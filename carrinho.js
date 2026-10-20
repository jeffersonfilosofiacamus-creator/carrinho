
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionarAoCarrinho(produto) {
    let encontrado = carrinho.find(item => item.id == produto.id);

    if (encontrado) {
        encontrado.quantidade = encontrado.quantidade + 1;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1
        });
    }

    salvarCarrinho();
    mostrarCarrinho();
}

function alterarQuantidade(id, valor) {
    let produto = carrinho.find(item => item.id == id);

    if (produto) {
        produto.quantidade = produto.quantidade + valor;

        if (produto.quantidade <= 0) {
            removerProduto(id);
            return;
        }
    }

    salvarCarrinho();
    mostrarCarrinho();
}

function removerProduto(id) {
    carrinho = carrinho.filter(item => item.id != id);

    salvarCarrinho();
    mostrarCarrinho();
}

function mostrarCarrinho() {
    let lista = document.getElementById("lista-carrinho");
    let vazio = document.getElementById("carrinho-vazio");
    let total = 0;
    let quantidade = 0;

    lista.innerHTML = "";

    for (let produto of carrinho) {
        total = total + produto.preco * produto.quantidade;
        quantidade = quantidade + produto.quantidade;

        let item = document.createElement("div");
        item.className = "item";

        let imagem = document.createElement("img");
        imagem.src = produto.imagem || "";
        imagem.alt = produto.nome;

        let informacoes = document.createElement("div");

        let nome = document.createElement("h3");
        nome.textContent = produto.nome;

        let preco = document.createElement("p");
        preco.textContent = Number(produto.preco).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        let qtd = document.createElement("p");
        qtd.textContent = "Quantidade: " + produto.quantidade;

        informacoes.append(nome, preco, qtd);

        let botoes = document.createElement("div");

        let diminuir = document.createElement("button");
        diminuir.textContent = "-";
        diminuir.onclick = function() {
            alterarQuantidade(produto.id, -1);
        };

        let aumentar = document.createElement("button");
        aumentar.textContent = "+";
        aumentar.onclick = function() {
            alterarQuantidade(produto.id, 1);
        };

        let remover = document.createElement("button");
        remover.textContent = "Remover";
        remover.onclick = function() {
            removerProduto(produto.id);
        };

        botoes.append(diminuir, aumentar, remover);
        item.append(imagem, informacoes, botoes);
        lista.appendChild(item);
    }

    document.getElementById("quantidade").textContent = quantidade;

    document.getElementById("total").textContent =
        total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    if (carrinho.length == 0) {
        vazio.style.display = "block";
    } else {
        vazio.style.display = "none";
    }
}

function finalizarCompra() {
    if (carrinho.length == 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let numero = ""; // Colocar o WhatsApp da revendedora

    if (numero == "") {
        alert("Configure o WhatsApp da revendedora.");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer este pedido:\n\n";
    let total = 0;

    for (let produto of carrinho) {
        let subtotal = produto.preco * produto.quantidade;

        mensagem += produto.nome + " - ";
        mensagem += produto.quantidade + " unidade(s) - ";
        mensagem += "R$ " + subtotal.toFixed(2) + "\n";

        total = total + subtotal;
    }

    mensagem += "\nTotal: R$ " + total.toFixed(2);
    mensagem += "\nEntrega a combinar.";

    let link = "https://wa.me/" + numero +
        "?text=" + encodeURIComponent(mensagem);

    window.open(link, "_blank");
}

mostrarCarrinho();
