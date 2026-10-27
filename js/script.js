// Cartas do jogo
const icons = [
    "🦟", // Mosquito
    "🚰", // Caixa d'água
    "🛞", // Pneu
    "🪣", // Balde
    "🪴", // Planta
    "🗑️", // Lixeira
    "🧹", // Limpeza
    "💧", // Água parada
    "🧴", // Repelente
    "👩‍⚕️", // Agente de saúde
    "🏠", // Casa
    "🌧️", // Chuva
    "🚮", // Coleta de lixo
    "🤒", // Sintomas
    "✅"  // Prevenção
];

// Mensagens educativas
const mensagens = {
    "🦟": "O mosquito Aedes Aegypti transmite a dengue.",
    "🚰": "Mantenha a caixa d'água sempre tampada.",
    "🛞": "Pneus podem acumular água e virar criadouros.",
    "🪣": "Guarde baldes virados para baixo.",
    "🪴": "Não deixe água acumulada nos pratos das plantas.",
    "🗑️": "Descarte o lixo corretamente.",
    "🧹": "Mantenha o quintal sempre limpo.",
    "💧": "Água parada favorece a reprodução do mosquito.",
    "🧴": "Use repelente para se proteger.",
    "👩‍⚕️": "Os agentes de saúde ajudam no combate à dengue.",
    "🏠": "Uma casa limpa é uma casa protegida.",
    "🌧️": "Após a chuva, elimine toda água parada.",
    "🚮": "A coleta de lixo evita focos do mosquito.",
    "🤒": "Febre e dores no corpo podem ser sintomas da dengue.",
    "✅": "A prevenção é a melhor forma de combater a dengue."
};

let totalPairs = 8;
let deck = [];

let first = null;
let lock = false;
let mov = 0;
let pts = 0;
let pairs = 0;
let sec = 0;
let intv = null;
let jogoAtivo = false;

function atualizarSlider(valor) {
    totalPairs = parseInt(valor, 10);
    document.getElementById("valor-pares").textContent = totalPairs;
    document.getElementById("valor-cartas").textContent = totalPairs * 2;
}

function configurarTamanhoTabuleiro(numPares) {
    let cols = 6;
    let size = 100;
    let fontSize = 45;

    if (numPares === 2) {
        cols = 2;
        size = 150;
        fontSize = 65;
    } else if (numPares === 3) {
        cols = 3;
        size = 140;
        fontSize = 60;
    } else if (numPares === 4) {
        cols = 4;
        size = 130;
        fontSize = 55;
    } else if (numPares <= 6) {
        cols = 4;
        size = 115;
        fontSize = 50;
    } else if (numPares <= 8) {
        cols = 4;
        size = 105;
        fontSize = 45;
    } else if (numPares <= 10) {
        cols = 5;
        size = 95;
        fontSize = 40;
    } else if (numPares <= 12) {
        cols = 6;
        size = 90;
        fontSize = 38;
    } else {
        cols = 6;
        size = 82;
        fontSize = 35;
    }

    // Ajuste responsivo caso a tela seja menor
    const larguraDisponivel = window.innerWidth - 40;
    if (window.innerWidth <= 600) {
        cols = Math.min(cols, numPares === 2 ? 2 : numPares === 3 ? 3 : 4);
    } else if (window.innerWidth <= 900) {
        cols = Math.min(cols, 5);
    }

    const gap = window.innerWidth <= 600 ? 10 : 15;
    const maxCardWidth = Math.floor((larguraDisponivel - (cols - 1) * gap) / cols);
    if (maxCardWidth < size) {
        size = Math.max(55, maxCardWidth);
        fontSize = Math.max(24, Math.round(size * 0.44));
    }

    board.style.setProperty("--grid-cols", cols);
    board.style.setProperty("--card-size", `${size}px`);
    board.style.setProperty("--card-font-size", `${fontSize}px`);
}

function prepararTelaJogo() {
    const nome = localStorage.getItem("nomeJogador") || "Jogador";
    player.textContent = "👤 " + nome;

    clearInterval(intv);
    jogoAtivo = false;
    sec = 0;
    mov = 0;
    pts = 0;
    pairs = 0;
    first = null;
    lock = false;

    t.textContent = "00:00";
    m.textContent = "0";
    p.textContent = "0";

    // Tabuleiro inicia vazio até definir a dificuldade
    board.innerHTML = "";

    game.style.display = "block";
    win.style.display = "none";

    const slider = document.getElementById("slider-pares");
    if (slider) {
        atualizarSlider(slider.value);
    }

    document.getElementById("modal-dificuldade").style.display = "flex";
}

function iniciarJogo() {
    const slider = document.getElementById("slider-pares");
    totalPairs = parseInt(slider.value, 10) || 8;

    document.getElementById("modal-dificuldade").style.display = "none";
    start(totalPairs);
}

function start(numPares = totalPairs) {
    const nome = localStorage.getItem("nomeJogador") || "Jogador";
    player.textContent = "👤 " + nome;

    sec = 0;
    mov = 0;
    pts = 0;
    pairs = 0;
    first = null;
    lock = false;
    jogoAtivo = true;

    t.textContent = "00:00";
    m.textContent = "0";
    p.textContent = "0";

    configurarTamanhoTabuleiro(numPares);

    const iconesSelecionados = [...icons]
        .sort(() => Math.random() - 0.5)
        .slice(0, numPares);

    deck = [...iconesSelecionados, ...iconesSelecionados].sort(
        () => Math.random() - 0.5
    );

    board.innerHTML = "";

    clearInterval(intv);

    intv = setInterval(() => {
        sec++;

        const min = String(Math.floor(sec / 60)).padStart(2, "0");
        const seg = String(sec % 60).padStart(2, "0");

        t.textContent = `${min}:${seg}`;
    }, 1000);

    deck.forEach(icon => {
        const carta = document.createElement("div");

        carta.className = "card";
        carta.textContent = "?";
        carta.dataset.valor = icon;
        carta.onclick = () => flip(carta);

        board.appendChild(carta);
    });
}

function flip(carta) {
    if (lock || carta.classList.contains("done") || carta === first) {
        return;
    }

    carta.textContent = carta.dataset.valor;
    carta.classList.add("open");

    if (!first) {
        first = carta;
        return;
    }

    mov++;
    m.textContent = mov;
    lock = true;

    if (first.dataset.valor === carta.dataset.valor) {
        first.classList.add("done");
        carta.classList.add("done");

        pts += 10;
        p.textContent = pts;

        pairs++;

        // Mostra uma dica educativa
        setTimeout(() => {
            mostrarAlerta(
                "🦟 Muito bem!",
                mensagens[carta.dataset.valor]
            );
        }, 200);

        first = null;
        lock = false;

        if (pairs === totalPairs) {
            console.log("Jogador venceu!");
            jogoAtivo = false;
            clearInterval(intv);

            // Envia o resultado para a API
            salvarRanking();

            game.style.display = "none";
            win.style.display = "flex";

            res.innerHTML = `
                <strong>Parabéns!</strong><br><br>
                Dificuldade: ${totalPairs} pares (${totalPairs * 2} cartas)<br>
                Tempo: ${t.textContent}<br>
                Pontos: ${pts}<br>
                Movimentos: ${mov}
            `;
        }
    } else {
        pts = Math.max(0, pts - 2);
        p.textContent = pts;

        setTimeout(() => {
            first.textContent = "?";
            carta.textContent = "?";

            first.classList.remove("open");
            carta.classList.remove("open");

            first = null;
            lock = false;
        }, 800);
    }
}

function confirmarSaida() {
    document.getElementById("modal-sair").style.display = "flex";
}

function fecharModalSair() {
    document.getElementById("modal-sair").style.display = "none";
}

function sairParaMenu() {
    clearInterval(intv);
    window.location.href = "/";
}

function jogarNovamente() {
    prepararTelaJogo();
}

async function salvarRanking() {
    console.log("Entrou na função salvarRanking");

    const nome = localStorage.getItem("nomeJogador") || "Jogador";
    try {
        const resposta = await fetch("/ranking/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                pontos: pts,
                tempo: sec,
                movimentos: mov,
                pares: totalPairs
            })
        });

        console.log("Status:", resposta.status);

        if (resposta.ok) {
            console.log("Ranking salvo com sucesso!");
            carregarRanking();
        } else {
            console.error("Erro ao salvar ranking");
        }
    } catch (erro) {
        console.error("Erro:", erro);
    }
}

async function carregarRanking() {
    try {
        const resposta = await fetch("/ranking/top10/");
        if (!resposta.ok) return;

        const jogadores = await resposta.json();
        const lista = document.getElementById("lista-ranking");

        lista.innerHTML = "";

        jogadores.forEach((jogador, index) => {
            const numPares = jogador.pares || 15;
            lista.innerHTML += `
            <li>
                <strong>${index + 1}º ${jogador.nome}</strong>
                <br>
                ⭐ ${jogador.pontos} pts | 🃏 ${numPares} pares
            </li>
            `;
        });
    } catch (erro) {
        console.error("Erro ao carregar ranking:", erro);
    }
}

function mostrarAlerta(titulo, mensagem) {
    lock = true;

    document.getElementById("titulo-alerta").textContent = titulo;
    document.getElementById("mensagem-alerta").textContent = mensagem;

    document.getElementById("alerta").style.display = "flex";

    setTimeout(() => {
        fecharAlerta();
    }, 2500);
}

function fecharAlerta() {
    document.getElementById("alerta").style.display = "none";
    lock = false;
}

window.addEventListener("resize", () => {
    if (jogoAtivo) {
        configurarTamanhoTabuleiro(totalPairs);
    }
});

window.onload = function () {
    prepararTelaJogo();
    carregarRanking();
};
