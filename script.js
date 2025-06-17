// Variáveis globais
let produtos = [];
let carrinho = [];
let whatsappNumber = "SEU_NUMERO_AQUI"; // Substitua pelo seu número de WhatsApp (ex: 5511999999999)
let isAdmin = false;
const adminEmail = "adm2025@";
const adminPassword = "senhar";

// Elementos da interface
const catalogPage = document.getElementById("catalog-page");
const loginPage = document.getElementById("login-page");
const adminPage = document.getElementById("admin-page");
const homeLink = document.getElementById("home-link");
const adminLink = document.getElementById("admin-link");
const listaProdutos = document.getElementById("lista-produtos");
const listaProdutosAdmin = document.getElementById("lista-produtos-admin");
const cabecalhoCatalogo = document.getElementById("cabecalho-catalogo");
const textoTitulo = document.getElementById("texto-titulo");
const textoPeriodo = document.getElementById("texto-periodo");
const areaCatalogo = document.getElementById("area-catalogo");
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const whatsappBtn = document.getElementById("whatsapp-btn");

// Carrega dados do localStorage
function carregarDados() {
  const dados = localStorage.getItem('catalogoNaldo');
  if (dados) {
    const parsed = JSON.parse(dados);
    produtos = parsed.produtos || [];
    atualizarCatalogo();
    
    // Configurações
    if (parsed.configuracoes) {
      const config = parsed.configuracoes;
      textoTitulo.textContent = config.titulo || "Semana de Ofertas Naldocomvocê!";
      textoPeriodo.textContent = config.periodo || "Válido de 14 a 21 de Junho ou enquanto durarem os estoques.";
      document.getElementById("admin-titulo-catalogo").value = config.titulo || "Semana de Ofertas Naldocomvocê!";
      document.getElementById("admin-periodo-catalogo").value = config.periodo || "Válido de 14 a 21 de Junho ou enquanto durarem os estoques.";
      
      if (config.imagemCabecalho) {
        cabecalhoCatalogo.innerHTML = `<img src="${config.imagemCabecalho}" alt="Cabeçalho do Catálogo" />`;
      }
    }
  }
}

// Salva dados no localStorage
function salvarDados() {
  const dados = {
    produtos: produtos,
    configuracoes: {
      titulo: document.getElementById("admin-titulo-catalogo").value,
      periodo: document.getElementById("admin-periodo-catalogo").value,
      imagemCabecalho: cabecalhoCatalogo.querySelector('img')?.src || ''
    }
  };
  localStorage.setItem('catalogoNaldo', JSON.stringify(dados));
}

// Atualiza o catálogo na página principal
function atualizarCatalogo() {
  listaProdutos.innerHTML = '';
  
  produtos.forEach(produto => {
    const produtoElement = document.createElement("div");
    produtoElement.className = "produto";
    produtoElement.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" />
      <h3>${produto.nome}</h3>
      <div class="codigo">Cód: ${produto.codigo}</div>
      <div class="preco">R$ ${produto.preco}</div>
      <button onclick="adicionarAoCarrinho('${produto.codigo}')">Adicionar</button>
    `;
    listaProdutos.appendChild(produtoElement);
  });
}

// Atualiza a lista de produtos no painel admin
function atualizarListaAdmin() {
  listaProdutosAdmin.innerHTML = '';
  
  produtos.forEach((produto, index) => {
    const produtoElement = document.createElement("div");
    produtoElement.className = "produto-item";
    produtoElement.innerHTML = `
      <div class="produto-info">
        <h3>${produto.nome}</h3>
        <p>Código: ${produto.codigo} | Preço: R$ ${produto.preco}</p>
      </div>
      <div class="produto-actions">
        <button onclick="removerProduto(${index})">Remover</button>
      </div>
    `;
    listaProdutosAdmin.appendChild(produtoElement);
  });
}

// Adiciona produto pelo admin
function adicionarProdutoAdmin() {
  const fileInput = document.getElementById("admin-imagem-produto");
  const nome = document.getElementById("admin-nome-produto").value.trim();
  const codigo = document.getElementById("admin-codigo-produto").value.trim();
  const preco = document.getElementById("admin-preco-produto").value.trim();

  if (!fileInput.files.length || !nome || !codigo || !preco) {
    alert("Preencha todos os campos do produto!");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const novoProduto = {
      nome: nome,
      codigo: codigo,
      preco: preco,
      imagem: e.target.result
    };
    
    produtos.push(novoProduto);
    salvarDados();
    atualizarCatalogo();
    atualizarListaAdmin();
    
    // Limpa campos
    fileInput.value = "";
    document.getElementById("admin-nome-produto").value = "";
    document.getElementById("admin-codigo-produto").value = "";
    document.getElementById("admin-preco-produto").value = "";
  };
  
  reader.readAsDataURL(file);
}

// Remove produto
function removerProduto(index) {
  if (confirm("Tem certeza que deseja remover este produto?")) {
    produtos.splice(index, 1);
    salvarDados();
    atualizarCatalogo();
    atualizarListaAdmin();
  }
}

// Salva configurações
function salvarConfiguracoes() {
  const fileInput = document.getElementById("admin-imagem-cabecalho");
  const titulo = document.getElementById("admin-titulo-catalogo").value;
  const periodo = document.getElementById("admin-periodo-catalogo").value;
  
  textoTitulo.textContent = titulo;
  textoPeriodo.textContent = periodo;
  
  if (fileInput.files.length) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      cabecalhoCatalogo.innerHTML = `<img src="${e.target.result}" alt="Cabeçalho do Catálogo" />`;
      salvarDados();
      fileInput.value = ""; // Limpa o input de arquivo
    };
    
    reader.readAsDataURL(file);
  } else {
    salvarDados();
  }
  
  alert("Configurações salvas com sucesso!");
}

// Login
function fazerLogin() {
  const email = document.getElementById("login-email").value.trim();
  const senha = document.getElementById("login-senha").value.trim();
  
  if (email === adminEmail && senha === adminPassword) {
    isAdmin = true;
    catalogPage.style.display = "none";
    loginPage.style.display = "none";
    adminPage.style.display = "block";
  } else {
    alert("E-mail ou senha incorretos! Verifique se digitou corretamente:\n\nE-mail: adm2025@\nSenha: senhar");
  }
}

// Logout
function logout() {
  isAdmin = false;
  catalogPage.style.display = "block";
  loginPage.style.display = "none";
  adminPage.style.display = "none";
}

// Navegação
homeLink.addEventListener("click", function(e) {
  e.preventDefault();
  catalogPage.style.display = "block";
  loginPage.style.display = "none";
  adminPage.style.display = "none";
});

adminLink.addEventListener("click", function(e) {
  e.preventDefault();
  if (isAdmin) {
    catalogPage.style.display = "none";
    loginPage.style.display = "none";
    adminPage.style.display = "block";
  } else {
    catalogPage.style.display = "none";
    loginPage.style.display = "block";
    adminPage.style.display = "none";
  }
});

// Carrinho de compras
function adicionarAoCarrinho(codigo) {
  const produto = produtos.find(p => p.codigo === codigo);
  if (!produto) return;
  
  const itemExistente = carrinho.find(item => item.codigo === codigo);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      ...produto,
      quantidade: 1
    });
  }
  
  atualizarCarrinho();
}

function atualizarCarrinho() {
  cartItems.innerHTML = '';
  let total = 0;
  
  carrinho.forEach(item => {
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
      <span>${item.nome} (${item.quantidade}x)</span>
      <span>R$ ${(parseFloat(item.preco) * item.quantidade).toFixed(2)}</span>
    `;
    cartItems.appendChild(itemElement);
    total += parseFloat(item.preco) * item.quantidade;
  });
  
  cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
  
  if (carrinho.length > 0) {
    cart.style.display = "block";
    
    // Prepara mensagem do WhatsApp
    let mensagem = "Olá, gostaria de fazer um pedido:\n\n";
    carrinho.forEach(item => {
      mensagem += `- ${item.nome} (Cód: ${item.codigo}) - ${item.quantidade}x - R$ ${(parseFloat(item.preco) * item.quantidade).toFixed(2)}\n`;
    });
    mensagem += `\nTotal: R$ ${total.toFixed(2)}`;
    
    whatsappBtn.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
  } else {
    cart.style.display = "none";
  }
}

// Limpa o carrinho (função adicional)
function limparCarrinho() {
  carrinho = [];
  atualizarCarrinho();
}

// Inicialização
document.addEventListener("DOMContentLoaded", function() {
  carregarDados();
  catalogPage.style.display = "block";
  loginPage.style.display = "none";
  adminPage.style.display = "none";
  
  // Adiciona botão para limpar carrinho
  const limparBtn = document.createElement("button");
  limparBtn.textContent = "Limpar";
  limparBtn.onclick = limparCarrinho;
  cart.insertBefore(limparBtn, whatsappBtn);
});