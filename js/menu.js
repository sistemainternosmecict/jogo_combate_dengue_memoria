function jogar() {

    const nome = document.getElementById("name").value.trim();

    if (nome === "") {
        alert("Digite seu nome.");
        return;
    }

    localStorage.setItem("nomeJogador", nome);

    window.location.href = "/jogo/";

}
