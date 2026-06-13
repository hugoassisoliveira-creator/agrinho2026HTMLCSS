const palavras = [
    "SUSTENTAVEL",
    "AGRICULTURA",
    "RECICLAGEM",
    "BIODIVERSO",
    "COMPOSTAGEM",
    "NASCENTE",
    "IRRIGACAO",
    "POLINIZAR",
    "FLORESTA",
    "ORGANICO",
    "ENERGIA",
    "PASTAGEM",
    "COLHEITA",
    "AMBIENTE"
];

const tamanho = 14;
const letrasExtras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let matriz = [];
let selecionadas = [];
let textoSelecionado = "";
let encontradas = 0;
let pontos = 0;
let segundos = 0;

const grid = document.getElementById("grid");
const listaPalavras = document.getElementById("listaPalavras");
const selecionadaTexto = document.getElementById("selecionada");
const mensagem = document.getElementById("mensagem");
const pontosTexto = document.getElementById("pontos");
const encontradasTexto = document.getElementById("encontradas");
const tempoTexto = document.getElementById("tempo");
const botaoLimpar = document.getElementById("limpar");

const posicoesPalavras = {};

function criarMatriz() {
    matriz = [];

    for (let linha = 0; linha < tamanho; linha++) {
        matriz[linha] = [];

        for (let coluna = 0; coluna < tamanho; coluna++) {
            matriz[linha][coluna] = "";
        }
    }
}

function podeColocar(palavra, linha, coluna, dl, dc) {
    for (let i = 0; i < palavra.length; i++) {
        const novaLinha = linha + i * dl;
        const novaColuna = coluna + i * dc;

        if (novaLinha < 0 || novaLinha >= tamanho || novaColuna < 0 || novaColuna >= tamanho) {
            return false;
        }

        if (matriz[novaLinha][novaColuna] !== "" && matriz[novaLinha][novaColuna] !== palavra[i]) {
            return false;
        }
    }

    return true;
}

function colocarPalavra(palavra) {
    const direcoes = [
        [0, 1],
        [1, 0],
        [1, 1],
        [-1, 1]
    ];

    let tentativas = 0;

    while (tentativas < 300) {
        const direcao = direcoes[Math.floor(Math.random() * direcoes.length)];
        const linha = Math.floor(Math.random() * tamanho);
        const coluna = Math.floor(Math.random() * tamanho);

        if (podeColocar(palavra, linha, coluna, direcao[0], direcao[1])) {
            posicoesPalavras[palavra] = [];

            for (let i = 0; i < palavra.length; i++) {
                const novaLinha = linha + i * direcao[0];
                const novaColuna = coluna + i * direcao[1];

                matriz[novaLinha][novaColuna] = palavra[i];
                posicoesPalavras[palavra].push(novaLinha + "-" + novaColuna);
            }

            return;
        }

        tentativas++;
    }
}

function preencherVazios() {
    for (let linha = 0; linha < tamanho; linha++) {
        for (let coluna = 0; coluna < tamanho; coluna++) {
            if (matriz[linha][coluna] === "") {
                matriz[linha][coluna] = letrasExtras[Math.floor(Math.random() * letrasExtras.length)];
            }
        }
    }
}

function desenharGrid() {
    grid.innerHTML = "";

    for (let linha = 0; linha < tamanho; linha++) {
        for (let coluna = 0; coluna < tamanho; coluna++) {
            const botao = document.createElement("button");
            botao.classList.add("letra");
            botao.textContent = matriz[linha][coluna];
            botao.setAttribute("data-pos", linha + "-" + coluna);

            botao.addEventListener("click", function() {
                selecionarLetra(botao);
            });

            grid.appendChild(botao);
        }
    }
}

function desenharLista() {
    listaPalavras.innerHTML = "";

    palavras.forEach(function(palavra) {
        const item = document.createElement("li");
        item.textContent = palavra;
        item.setAttribute("id", "palavra-" + palavra);
        listaPalavras.appendChild(item);
    });
}

function selecionarLetra(botao) {
    if (botao.classList.contains("encontrada") || botao.classList.contains("selecionada")) {
        return;
    }

    botao.classList.add("selecionada");
    selecionadas.push(botao);
    textoSelecionado += botao.textContent;
    selecionadaTexto.textContent = textoSelecionado;

    verificarPalavra();
}

function verificarPalavra() {
    if (palavras.includes(textoSelecionado)) {
        marcarPalavra(textoSelecionado);
    }

    const invertida = textoSelecionado.split("").reverse().join("");

    if (palavras.includes(invertida)) {
        marcarPalavra(invertida);
    }
}

function marcarPalavra(palavra) {
    selecionadas.forEach(function(botao) {
        botao.classList.remove("selecionada");
        botao.classList.add("encontrada");
    });

    const item = document.getElementById("palavra-" + palavra);
    item.classList.add("ok");

    encontradas++;
    pontos += palavra.length * 10;

    pontosTexto.textContent = pontos;
    encontradasTexto.textContent = encontradas + "/" + palavras.length;

    mensagem.innerHTML = "✅ Palavra encontrada: <strong>" + palavra + "</strong><br>Você ganhou " + (palavra.length * 10) + " pontos.";

    limparSelecao();

    if (encontradas === palavras.length) {
        clearInterval(cronometro);
        mensagem.innerHTML = "🎉 Parabéns! Você encontrou todas as palavras em " + tempoTexto.textContent + " e fez " + pontos + " pontos.";
    }
}

function limparSelecao() {
    selecionadas.forEach(function(botao) {
        if (!botao.classList.contains("encontrada")) {
            botao.classList.remove("selecionada");
        }
    });

    selecionadas = [];
    textoSelecionado = "";
    selecionadaTexto.textContent = "---";
}

botaoLimpar.addEventListener("click", limparSelecao);

function atualizarTempo() {
    segundos++;
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;

    tempoTexto.textContent =
        String(minutos).padStart(2, "0") + ":" +
        String(resto).padStart(2, "0");
}

const cronometro = setInterval(atualizarTempo, 1000);

criarMatriz();
palavras.forEach(colocarPalavra);
preencherVazios();
desenharGrid();
desenharLista();
