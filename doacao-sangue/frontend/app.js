const URL_API = '/api/doadores';

const formulario = document.getElementById('formulario');
const lista = document.getElementById('lista');
const mensagem = document.getElementById('mensagem');
const filtro = document.getElementById('filtro');
const botaoSalvar = document.getElementById('botaoSalvar');
const botaoCancelar = document.getElementById('botaoCancelar');

function mostrarMensagem(texto, classe) {
  mensagem.textContent = texto;
  mensagem.className = classe;
}

function criarCelula(texto) {
  const celula = document.createElement('td');
  celula.textContent = texto;
  return celula;
}

function criarBotao(texto, aoClicar, cinza) {
  const botao = document.createElement('button');
  botao.textContent = texto;
  if (cinza) botao.className = 'cinza';
  botao.addEventListener('click', aoClicar);
  return botao;
}

async function carregarLista() {
  let url = URL_API;
  if (filtro.value) {
    url += '?tipoSanguineo=' + encodeURIComponent(filtro.value);
  }

  const resposta = await fetch(url);
  const doadores = await resposta.json();

  lista.innerHTML = '';
  for (const doador of doadores) {
    const linha = document.createElement('tr');
    linha.appendChild(criarCelula(doador.nome));
    linha.appendChild(criarCelula(doador.email));
    linha.appendChild(criarCelula(doador.tipoSanguineo));
    linha.appendChild(criarCelula(doador.disponivel ? 'Sim' : 'Não'));

    const acoes = document.createElement('td');
    acoes.appendChild(criarBotao('Editar', () => editar(doador)));
    acoes.appendChild(criarBotao(doador.disponivel ? 'Desativar' : 'Ativar', () => mudarDisponibilidade(doador), true));
    acoes.appendChild(criarBotao('Excluir', () => excluir(doador), true));
    linha.appendChild(acoes);

    lista.appendChild(linha);
  }
}

function limparFormulario() {
  formulario.reset();
  document.getElementById('id').value = '';
  document.getElementById('disponivel').checked = true;
  botaoSalvar.textContent = 'Cadastrar';
  botaoCancelar.hidden = true;
}

function editar(doador) {
  document.getElementById('id').value = doador.id;
  document.getElementById('nome').value = doador.nome;
  document.getElementById('email').value = doador.email;
  document.getElementById('carteirinha').value = doador.carteirinha || '';
  document.getElementById('tipoSanguineo').value = doador.tipoSanguineo;
  document.getElementById('disponivel').checked = doador.disponivel;
  botaoSalvar.textContent = 'Salvar';
  botaoCancelar.hidden = false;
  window.scrollTo(0, 0);
}

async function mudarDisponibilidade(doador) {
  await fetch(URL_API + '/' + doador.id + '/disponibilidade', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disponivel: !doador.disponivel }),
  });
  carregarLista();
}

async function excluir(doador) {
  if (!confirm('Excluir ' + doador.nome + '?')) return;

  const resposta = await fetch(URL_API + '/' + doador.id, { method: 'DELETE' });
  if (resposta.ok) {
    mostrarMensagem('Doador excluído', 'sucesso');
    carregarLista();
  } else {
    const dados = await resposta.json();
    mostrarMensagem(dados.erro, 'erro');
  }
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = document.getElementById('id').value;
  const doador = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    carteirinha: document.getElementById('carteirinha').value,
    tipoSanguineo: document.getElementById('tipoSanguineo').value,
    disponivel: document.getElementById('disponivel').checked,
  };

  const resposta = await fetch(id ? URL_API + '/' + id : URL_API, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doador),
  });
  const dados = await resposta.json();

  if (resposta.ok) {
    mostrarMensagem(id ? 'Cadastro atualizado' : 'Cadastro realizado', 'sucesso');
    limparFormulario();
    carregarLista();
  } else {
    mostrarMensagem(dados.erro, 'erro');
  }
});

botaoCancelar.addEventListener('click', limparFormulario);
filtro.addEventListener('change', carregarLista);

carregarLista();
