const btnAdd = document.getElementById("btnAdd");
const boxLista = document.getElementById("lista");

function produtoJaExiste(produto) {
  return [...document.querySelectorAll("#lista li")].some(
    (li) =>
      li
        .querySelector(".span-produto span:first-child")
        .textContent.replace("Prod:", "")
        .trim() === produto
  );
}

btnAdd.addEventListener("click", function () {
  const produto = document.getElementById("produto").value.trim();
  const quantidade = document.getElementById("quantidade").value.trim();

  if (produtoJaExiste(produto)) {
    Toastify({
      text: "🔍 Este produto já foi adicionado!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      style: {
        background: "linear-gradient(to right, #4b6cb7, #182848)",
        borderRadius: "8px",
      },
    }).showToast();
    return;
  }

  if (!isNaN(produto) || !produto) {
    Toastify({
      text: "❌ Digite um produto válido!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      style: {
        background: "linear-gradient(to right,rgb(151, 26, 56), #ff4b2b)",
      },
    }).showToast();
    return;
  }
  if (!quantidade) {
    Toastify({
      text: "⚠️ Digite uma quantidade!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      style: {
        background: "linear-gradient(to right,rgb(163, 100, 10), #ffcc33)",
        borderRadius: "8px",
      },
    }).showToast();
    return;
  }

  adicionarProdutoNaLista(produto, quantidade, false, false);
  salvarListaNoLocalStorage();

  Toastify({
    text: "✅ Produto adicionado com sucesso!",
    duration: 3000,
    gravity: "top",
    position: "center",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
      borderRadius: "8px",
    },
  }).showToast();
});

function adicionarProdutoNaLista(
  produto,
  quantidade,
  peguei = false,
  faltou = false
) {
  const lista = document.createElement("li");
  lista.innerHTML = `
      <span class="span-produto">
        <span><strong>Prod:</strong>${produto}</span>
        <span><strong>Qtd:</strong>${quantidade}</span>
      </span>
      <span>
        <p class="faltou">Faltou</p>
        <input type="checkbox" class="checkbox-faltou">
        <p class="peguei">Peguei</p>
        <input type="checkbox" class="checkbox"> 
        <button class="btnRemover"><i class="bi bi-trash3-fill"></i></button>
      </span>
    `;

  boxLista.appendChild(lista);

  const checkbox = lista.querySelector(".checkbox");
  const checkboxFaltou = lista.querySelector(".checkbox-faltou");

  checkbox.checked = peguei;
  checkboxFaltou.checked = faltou;

  if (peguei) {
    lista.style.backgroundColor = "#83f79e";
    checkboxFaltou.style.display = "none";
    lista.querySelector(".faltou").style.display = "none";
  } else if (faltou) {
    lista.style.backgroundColor = "#f58326";
    checkbox.style.display = "none";
    lista.querySelector(".peguei").style.display = "none";
  }

  lista.querySelector(".btnRemover").addEventListener("click", function () {
    boxLista.removeChild(lista);
    salvarListaNoLocalStorage();
    Toastify({
      text: "⚠️ Produto removido da lista!",
      duration: 2000,
      gravity: "top",
      position: "center",
      style: {
        background: "rgb(255, 34, 4)",
        borderRadius: "8px",
      },
    }).showToast();
  });

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      lista.style.backgroundColor = "#83f79e";
      checkboxFaltou.style.display = "none";
      lista.querySelector(".faltou").style.display = "none";
      Toastify({
        text: "✅ Botei o produto no carrinho!",
        duration: 2000,
        gravity: "top",
        position: "center",
        style: {
          background: "#00b09b",
          borderRadius: "8px",
        },
      }).showToast();
    } else {
      lista.style.backgroundColor = "";
      checkboxFaltou.style.display = "block";
      lista.querySelector(".faltou").style.display = "block";
    }
    salvarListaNoLocalStorage();
  });

  checkboxFaltou.addEventListener("change", function () {
    if (checkboxFaltou.checked) {
      lista.style.backgroundColor = "#f58326";
      checkbox.style.display = "none";
      lista.querySelector(".peguei").style.display = "none";
      Toastify({
        text: "⚠️ Produto em falta no mercado!",
        duration: 2000,
        gravity: "top",
        position: "center",
        style: {
          background: "#e0a500",
          borderRadius: "8px",
        },
      }).showToast();
    } else {
      lista.style.backgroundColor = "";
      checkbox.style.display = "block";
      lista.querySelector(".peguei").style.display = "block";
    }
    salvarListaNoLocalStorage();
  });
}

// 🔹 **Função para salvar no Local Storage**
function salvarListaNoLocalStorage() {
  const listaItens = [];
  document.querySelectorAll("#lista li").forEach((item) => {
    const produto = item
      .querySelector(".span-produto span:first-child strong")
      .nextSibling.textContent.trim();
    const quantidade = item
      .querySelector(".span-produto span:nth-child(2)")
      .textContent.replace("Qtd:", "")
      .trim();
    const peguei = item.querySelector(".checkbox").checked;
    const faltou = item.querySelector(".checkbox-faltou").checked;

    listaItens.push({ produto, quantidade, peguei, faltou });
  });

  localStorage.setItem("listaProdutos", JSON.stringify(listaItens));
}

// 🔹 **Função para carregar a lista do Local Storage**
function carregarListaDoLocalStorage() {
  const listaSalva = JSON.parse(localStorage.getItem("listaProdutos")) || [];
  listaSalva.forEach(({ produto, quantidade, peguei, faltou }) => {
    adicionarProdutoNaLista(produto, quantidade, peguei, faltou);
  });
}

document.addEventListener("DOMContentLoaded", carregarListaDoLocalStorage);
