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

let deck = [...icons, ...icons].sort(() => Math.random() - 0.5);

let first = null;
let lock = false;
let mov = 0;
let pts = 0;
let pairs = 0;
let sec = 0;
let intv;

function start() {

    const nome = localStorage.getItem("nomeJogador") || "Jogador";

    player.textContent = "👤 " + nome;

    sec = 0;
    mov = 0;
    pts = 0;
    pairs = 0;

    t.textContent = "00:00";
    m.textContent = "0";
    p.textContent = "0";

    deck = [...icons, ...icons].sort(() => Math.random() - 0.5);

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

if (pairs === icons.length) {

    console.log("Jogador venceu!");

    clearInterval(intv);

    // Envia o resultado para a API
    salvarRanking();

    game.style.display = "none";
    win.style.display = "flex";

    res.innerHTML = `
        <strong>Parabéns!</strong><br><br>
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
async function salvarRanking() {

    console.log("Entrou na função salvarRanking");

    const nome = localStorage.getItem("nomeJogador") || "Jogador";
    try {
        const resposta = await fetch("http://127.0.0.1:8000/ranking/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                pontos: pts,
                tempo: sec,
                movimentos: mov
            })
        });

        console.log("Status:", resposta.status);

        if (resposta.ok) {
            console.log("Ranking salvo com sucesso!");
        } else {
            console.error("Erro ao salvar ranking");
        }

    } catch (erro) {
        console.error("Erro:", erro);
    }
}async function carregarRanking(){

    const resposta = await fetch("http://127.0.0.1:8000/ranking/top10/");

    const jogadores = await resposta.json();

    const lista = document.getElementById("lista-ranking");

    lista.innerHTML = "";

    jogadores.forEach((jogador,index)=>{

        lista.innerHTML += `
        <li>
            ${index+1}º ${jogador.nome}
            <br>
            ⭐ ${jogador.pontos} pontos
        </li>
        `;

    });
}

carregarRanking();

function mostrarAlerta(titulo, mensagem) {

    document.getElementById("titulo-alerta").textContent = titulo;
    document.getElementById("mensagem-alerta").textContent = mensagem;

    document.getElementById("alerta").style.display = "flex";
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

window.onload = function () {
    start();
};