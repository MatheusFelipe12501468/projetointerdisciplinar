document.documentElement.setAttribute("data-theme", localStorage.getItem("tema") || "claro");

const produtos = [
  { id: 1, nome: "Pizza Calabresa", preco: 49.90, categoria: "Pizza", descricao: "Calabresa fatiada, cebola, mussarela e orégano.", imagem: "pizza-calabresa.svg" },
  { id: 2, nome: "Pizza Mussarela", preco: 45.90, categoria: "Pizza", descricao: "Mussarela derretida, molho de tomate e orégano.", imagem: "pizza-mussarela.svg" },
  { id: 3, nome: "Pizza Portuguesa", preco: 54.90, categoria: "Pizza", descricao: "Presunto, ovos, cebola, azeitonas e mussarela.", imagem: "pizza-portuguesa.svg" },
  { id: 6, nome: "Pizza Margherita", preco: 47.90, categoria: "Pizza", descricao: "Tomate fresco, mussarela de búfala e manjericão.", imagem: "pizza-margherita.svg" },
  { id: 7, nome: "Pizza Frango com Catupiry", preco: 52.90, categoria: "Pizza", descricao: "Frango desfiado temperado e catupiry cremoso.", imagem: "pizza-frango.svg" },
  { id: 8, nome: "Pizza Quatro Queijos", preco: 56.90, categoria: "Pizza", descricao: "Mussarela, provolone, parmesão e gorgonzola.", imagem: "pizza-quatro-queijos.svg" },
  { id: 9, nome: "Pizza de Chocolate", preco: 44.90, categoria: "Pizza", descricao: "Pizza doce com chocolate ao leite e morangos.", imagem: "pizza-chocolate.svg" },
  { id: 4, nome: "Refrigerante 2L", preco: 12.00, categoria: "Bebida", descricao: "Refrigerante sabor cola, garrafa de 2 litros.", imagem: "bebida-refrigerante.svg" },
  { id: 5, nome: "Suco Natural 500ml", preco: 9.00, categoria: "Bebida", descricao: "Suco de laranja natural, feito na hora.", imagem: "bebida-suco.svg" },
  { id: 10, nome: "Água Mineral 500ml", preco: 4.00, categoria: "Bebida", descricao: "Água mineral sem gás, garrafa de 500 ml.", imagem: "bebida-agua.svg" }
];

const clientesTeste = [
  { id: 1, nome: "Ana Souza", email: "ana@email.com", senha: "123", telefone: "(31) 99999-1111", cep: "30110-000", rua: "Rua das Flores", numero: "100", complemento: "", bairro: "Centro", cidade: "Belo Horizonte" },
  { id: 2, nome: "Bruno Lima", email: "bruno@email.com", senha: "123", telefone: "(31) 99999-2222", cep: "30130-000", rua: "Av. Brasil", numero: "250", complemento: "", bairro: "Funcionários", cidade: "Belo Horizonte" }
];

const camposCliente = ["nome", "email", "telefone", "cep", "cidade", "rua", "numero", "complemento", "bairro"];

function ler(chave, padrao) {
  return JSON.parse(localStorage.getItem(chave)) || padrao;
}

function salvar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function dinheiro(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function buscarProduto(id) {
  return produtos.find(p => p.id == id);
}

function listaClientes() {
  return ler("clientes", clientesTeste);
}

function clienteLogado() {
  const id = ler("logado", null);
  return listaClientes().find(c => c.id == id);
}

function enderecoCompleto(c) {
  let texto = c.rua + ", " + c.numero;
  if (c.complemento) {
    texto += " - " + c.complemento;
  }
  return texto + " - " + c.bairro + " - " + c.cidade + " - CEP " + c.cep;
}

function lerCarrinho() {
  return ler("carrinho", []);
}

function salvarCarrinho(carrinho) {
  salvar("carrinho", carrinho);
  atualizarContador();
}

function atualizarContador() {
  const contador = document.getElementById("contadorCarrinho");
  let total = 0;
  lerCarrinho().forEach(item => total += item.quantidade);
  contador.textContent = total;
  contador.hidden = total == 0;
}

function totalCarrinho(carrinho) {
  let total = 0;
  carrinho.forEach(item => total += buscarProduto(item.id).preco * item.quantidade);
  return Math.round(total * 100) / 100;
}

function adicionarAoCarrinho(id) {
  const carrinho = lerCarrinho();
  const item = carrinho.find(i => i.id == id);

  if (item) {
    if (item.quantidade < 20) {
      item.quantidade++;
    }
  } else {
    carrinho.push({ id: Number(id), quantidade: 1 });
  }

  salvarCarrinho(carrinho);
  aviso(buscarProduto(id).nome + " foi para o carrinho!");
}

function aviso(texto) {
  const div = document.createElement("div");
  div.className = "aviso";
  div.textContent = texto;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2500);
}

function cardProduto(p) {
  return `
    <article class="card-produto">
      <img src="${p.imagem}" alt="${p.nome}">
      <div class="card-produto-corpo">
        <span class="etiqueta">${p.categoria}</span>
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <div class="card-produto-rodape">
          <strong class="preco">${dinheiro(p.preco)}</strong>
          <button class="botao" data-id="${p.id}">Adicionar</button>
        </div>
      </div>
    </article>`;
}

function mostrarProdutos(lista, area) {
  area.innerHTML = lista.map(cardProduto).join("");
  area.querySelectorAll("[data-id]").forEach(botao => {
    botao.addEventListener("click", () => adicionarAoCarrinho(botao.dataset.id));
  });
}

function mascaraTelefone(valor) {
  const n = valor.replace(/\D/g, "").substring(0, 11);
  if (n.length > 10) return "(" + n.substring(0, 2) + ") " + n.substring(2, 7) + "-" + n.substring(7);
  if (n.length > 6) return "(" + n.substring(0, 2) + ") " + n.substring(2, 6) + "-" + n.substring(6);
  if (n.length > 2) return "(" + n.substring(0, 2) + ") " + n.substring(2);
  if (n.length > 0) return "(" + n;
  return "";
}

function mascaraCep(valor) {
  const n = valor.replace(/\D/g, "").substring(0, 8);
  if (n.length > 5) return n.substring(0, 5) + "-" + n.substring(5);
  return n;
}

function ativarMascaras() {
  document.querySelectorAll("[data-mascara]").forEach(campo => {
    campo.addEventListener("input", () => {
      if (campo.dataset.mascara == "telefone") campo.value = mascaraTelefone(campo.value);
      if (campo.dataset.mascara == "cep") campo.value = mascaraCep(campo.value);
      if (campo.dataset.mascara == "numero") campo.value = campo.value.replace(/\D/g, "");
    });
  });
}

function preencherCampos(cliente) {
  camposCliente.forEach(campo => document.getElementById(campo).value = cliente[campo]);
}

function lerCampos() {
  const dados = {};
  camposCliente.forEach(campo => dados[campo] = document.getElementById(campo).value.trim());
  dados.email = dados.email.toLowerCase();
  return dados;
}

function emailEmUso(email, idIgnorar) {
  return listaClientes().some(c => c.email == email && c.id != idIgnorar);
}

function paginaDeVolta(padrao) {
  const voltar = new URLSearchParams(location.search).get("voltar");
  const paginas = ["carrinho.html", "pedidos.html", "perfil.html"];
  return paginas.includes(voltar) ? voltar : padrao;
}

function baixarJson(pedido) {
  const dados = [{
    IdPedido: pedido.IdPedido,
    FkCliente: pedido.FkCliente,
    Valor: pedido.Valor,
    Status: pedido.Status,
    NomeEntregador: pedido.NomeEntregador,
    DataPedido: pedido.DataPedido,
    Cliente: pedido.Cliente,
    Itens: pedido.Itens
  }];

  const arquivo = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "pedido-" + pedido.IdPedido + ".json";
  link.click();
}

function prepararCabecalho() {
  const cliente = clienteLogado();
  document.getElementById("menuVisitante").hidden = !!cliente;
  document.getElementById("menuLogado").hidden = !cliente;

  if (cliente) {
    document.getElementById("linkPerfil").textContent = "Olá, " + cliente.nome.split(" ")[0];
  }

  document.getElementById("botaoSair").addEventListener("click", () => {
    localStorage.removeItem("logado");
    location.href = "index.html";
  });

  document.getElementById("menuBotao").addEventListener("click", () => {
    document.getElementById("menu").classList.toggle("aberto");
  });

  const temaBotao = document.getElementById("temaBotao");
  temaBotao.textContent = localStorage.getItem("tema") == "escuro" ? "☀" : "☾";
  temaBotao.addEventListener("click", () => {
    const novoTema = localStorage.getItem("tema") == "escuro" ? "claro" : "escuro";
    localStorage.setItem("tema", novoTema);
    document.documentElement.setAttribute("data-theme", novoTema);
    temaBotao.textContent = novoTema == "escuro" ? "☀" : "☾";
  });

  atualizarContador();
}

function paginaInicio() {
  const destaques = [1, 7, 8, 3].map(buscarProduto);
  mostrarProdutos(destaques, document.getElementById("destaques"));
}

function paginaProdutos() {
  const campoBusca = document.getElementById("campoBusca");
  let categoria = "Todos";

  function filtrar() {
    const busca = campoBusca.value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const lista = produtos.filter(p => {
      const texto = (p.nome + " " + p.descricao).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      return texto.includes(busca) && (categoria == "Todos" || p.categoria == categoria);
    });
    mostrarProdutos(lista, document.getElementById("gradeProdutos"));
    document.getElementById("resultadoBusca").textContent = lista.length + " produto(s) encontrado(s)";
    document.getElementById("semResultados").hidden = lista.length > 0;
  }

  campoBusca.value = new URLSearchParams(location.search).get("busca") || "";
  campoBusca.addEventListener("input", filtrar);

  document.getElementById("formBusca").addEventListener("submit", evento => {
    evento.preventDefault();
    filtrar();
  });

  document.querySelectorAll(".filtro").forEach(botao => {
    botao.addEventListener("click", () => {
      document.querySelectorAll(".filtro").forEach(b => b.classList.remove("ativo"));
      botao.classList.add("ativo");
      categoria = botao.dataset.categoria;
      filtrar();
    });
  });

  filtrar();
}

function paginaCarrinho() {
  function mostrar() {
    const carrinho = lerCarrinho();
    document.getElementById("carrinhoVazio").hidden = carrinho.length > 0;
    document.getElementById("layoutCarrinho").hidden = carrinho.length == 0;

    document.getElementById("listaCarrinho").innerHTML = carrinho.map(item => {
      const p = buscarProduto(item.id);
      return `
        <div class="item-carrinho">
          <img src="${p.imagem}" alt="${p.nome}">
          <div class="item-nome"><h3>${p.nome}</h3><small>${dinheiro(p.preco)} cada</small></div>
          <div class="quantidade">
            <button data-menos="${p.id}">−</button>
            <input type="text" inputmode="numeric" maxlength="2" value="${item.quantidade}" data-qtd="${p.id}">
            <button data-mais="${p.id}">+</button>
          </div>
          <strong class="subtotal">${dinheiro(p.preco * item.quantidade)}</strong>
          <button class="remover" data-remover="${p.id}" title="Remover">×</button>
        </div>`;
    }).join("");

    const total = totalCarrinho(carrinho);
    document.getElementById("subtotalCarrinho").textContent = dinheiro(total);
    document.getElementById("totalCarrinho").textContent = dinheiro(total);

    const cliente = clienteLogado();
    const endereco = document.getElementById("enderecoEntrega");
    if (cliente) {
      endereco.innerHTML = "<strong>Entregar em:</strong>";
      endereco.append(enderecoCompleto(cliente));
    } else {
      endereco.innerHTML = '<strong>Você não está logado</strong><a href="login.html?voltar=carrinho.html">Entre</a> ou <a href="cadastro.html?voltar=carrinho.html">crie uma conta</a> para finalizar.';
    }
  }

  function mudarQuantidade(id, quantidade) {
    let carrinho = lerCarrinho();
    if (quantidade < 1) {
      carrinho = carrinho.filter(i => i.id != id);
    } else {
      carrinho.find(i => i.id == id).quantidade = Math.min(quantidade, 20);
    }
    salvarCarrinho(carrinho);
    mostrar();
  }

  const lista = document.getElementById("listaCarrinho");

  lista.addEventListener("click", evento => {
    const b = evento.target.dataset;
    const item = lerCarrinho().find(i => i.id == (b.mais || b.menos || b.remover));
    if (!item) return;
    if (b.mais) mudarQuantidade(item.id, item.quantidade + 1);
    if (b.menos) mudarQuantidade(item.id, item.quantidade - 1);
    if (b.remover) mudarQuantidade(item.id, 0);
  });

  lista.addEventListener("input", evento => {
    evento.target.value = evento.target.value.replace(/\D/g, "");
  });

  lista.addEventListener("change", evento => {
    mudarQuantidade(evento.target.dataset.qtd, Number(evento.target.value));
  });

  document.getElementById("botaoFinalizar").addEventListener("click", () => {
    const cliente = clienteLogado();
    if (!cliente) {
      location.href = "login.html?voltar=carrinho.html";
      return;
    }

    const carrinho = lerCarrinho();
    const total = totalCarrinho(carrinho);
    if (!confirm("Confirmar pedido no valor de " + dinheiro(total) + "?")) return;

    const pedido = {
      IdPedido: Math.floor(Date.now() / 1000) - 1700000000,
      FkCliente: cliente.id,
      Valor: total,
      Status: "pendente",
      NomeEntregador: "",
      DataPedido: new Date().toISOString(),
      Cliente: { Nome: cliente.nome, Email: cliente.email, Telefone: cliente.telefone, Endereco: enderecoCompleto(cliente) },
      Itens: carrinho.map(item => ({
        FkProduto: item.id,
        Nome: buscarProduto(item.id).nome,
        Quantidade: item.quantidade,
        PrecoUnitario: buscarProduto(item.id).preco
      }))
    };

    const pedidos = ler("pedidos", []);
    pedidos.push(pedido);
    salvar("pedidos", pedidos);

    baixarJson(pedido);
    salvarCarrinho([]);
    location.href = "pedidos.html?novo=" + pedido.IdPedido;
  });

  mostrar();
}

function paginaPedidos() {
  const cliente = clienteLogado();
  if (!cliente) {
    location.href = "login.html?voltar=pedidos.html";
    return;
  }

  const novo = new URLSearchParams(location.search).get("novo");
  if (novo) {
    const mensagem = document.getElementById("mensagemNovoPedido");
    mensagem.hidden = false;
    mensagem.textContent = "Pedido nº " + novo + " realizado com sucesso! O arquivo pedido-" + novo + ".json foi gerado para a pizzaria.";
  }

  const meusPedidos = ler("pedidos", []).filter(p => p.FkCliente == cliente.id).reverse();
  document.getElementById("semPedidos").hidden = meusPedidos.length > 0;

  const lista = document.getElementById("listaPedidos");
  lista.innerHTML = meusPedidos.map(pedido => `
    <article class="card-pedido">
      <div class="card-pedido-topo">
        <div>
          <h3>Pedido nº ${pedido.IdPedido}</h3>
          <small>${new Date(pedido.DataPedido).toLocaleString("pt-BR")}</small>
        </div>
        <span class="status status-${pedido.Status}">${pedido.Status}</span>
      </div>
      <ul class="itens-pedido">
        ${pedido.Itens.map(i => `<li><span>${i.Quantidade}x ${i.Nome}</span><span>${dinheiro(i.PrecoUnitario * i.Quantidade)}</span></li>`).join("")}
      </ul>
      <div class="linha-resumo linha-total"><span>Total</span><span>${dinheiro(pedido.Valor)}</span></div>
      <div class="card-pedido-rodape">
        <button class="botao botao-contorno" data-baixar="${pedido.IdPedido}">Baixar JSON</button>
      </div>
    </article>`).join("");

  lista.querySelectorAll("[data-baixar]").forEach(botao => {
    botao.addEventListener("click", () => {
      baixarJson(meusPedidos.find(p => p.IdPedido == botao.dataset.baixar));
    });
  });
}

function paginaLogin() {
  document.getElementById("formLogin").addEventListener("submit", evento => {
    evento.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value;
    const cliente = listaClientes().find(c => c.email == email && c.senha == senha);

    if (!cliente) {
      aviso("E-mail ou senha incorretos.");
      return;
    }

    salvar("logado", cliente.id);
    location.href = paginaDeVolta("index.html");
  });
}

function paginaCadastro() {
  document.getElementById("formCadastro").addEventListener("submit", evento => {
    evento.preventDefault();
    const clientes = listaClientes();
    const novo = lerCampos();

    if (emailEmUso(novo.email, null)) {
      aviso("Já existe uma conta com este e-mail.");
      document.getElementById("email").focus();
      return;
    }

    novo.senha = document.getElementById("senha").value;
    novo.id = Math.max(...clientes.map(c => c.id)) + 1;
    clientes.push(novo);
    salvar("clientes", clientes);
    salvar("logado", novo.id);
    location.href = paginaDeVolta("produtos.html");
  });
}

function paginaPerfil() {
  const cliente = clienteLogado();
  if (!cliente) {
    location.href = "login.html?voltar=perfil.html";
    return;
  }

  function mostrarTopo(c) {
    document.getElementById("avatar").textContent = c.nome[0].toUpperCase();
    document.getElementById("nomePerfil").textContent = c.nome;
    document.getElementById("codigoPerfil").textContent = "Código do cliente: " + c.id;
  }

  mostrarTopo(cliente);
  preencherCampos(cliente);

  document.getElementById("formPerfil").addEventListener("submit", evento => {
    evento.preventDefault();
    const dados = lerCampos();

    if (emailEmUso(dados.email, cliente.id)) {
      aviso("Já existe uma conta com este e-mail.");
      return;
    }

    const novaSenha = document.getElementById("novaSenha").value;
    if (novaSenha) {
      dados.senha = novaSenha;
    }

    const clientes = listaClientes();
    const indice = clientes.findIndex(c => c.id == cliente.id);
    clientes[indice] = Object.assign(clientes[indice], dados);
    salvar("clientes", clientes);

    mostrarTopo(clientes[indice]);
    document.getElementById("linkPerfil").textContent = "Olá, " + clientes[indice].nome.split(" ")[0];
    document.getElementById("novaSenha").value = "";
    aviso("Dados atualizados com sucesso!");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  prepararCabecalho();
  ativarMascaras();

  const pagina = document.body.dataset.pagina;
  if (pagina == "inicio") paginaInicio();
  if (pagina == "produtos") paginaProdutos();
  if (pagina == "carrinho") paginaCarrinho();
  if (pagina == "pedidos") paginaPedidos();
  if (pagina == "login") paginaLogin();
  if (pagina == "cadastro") paginaCadastro();
  if (pagina == "perfil") paginaPerfil();
});
