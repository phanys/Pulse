const repository = require('../repository/DoadorRepository');
const Doador = require('../model/Doador');

const TIPOS_VALIDOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// erro com status http, pra o controller saber o que responder
function criarErro(status, mensagem) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function validar(dados) {
  if (!dados.nome || dados.nome.trim() === '') {
    throw criarErro(400, 'O nome é obrigatório');
  }
  if (!dados.email || !dados.email.includes('@')) {
    throw criarErro(400, 'E-mail inválido');
  }
  if (!TIPOS_VALIDOS.includes(dados.tipoSanguineo)) {
    throw criarErro(400, 'Tipo sanguíneo inválido');
  }
}

function montarDoador(dados) {
  return new Doador(
    null,
    dados.nome.trim(),
    dados.email,
    dados.carteirinha || null,
    dados.tipoSanguineo,
    dados.disponivel === undefined ? true : dados.disponivel
  );
}

// 23505 = valor repetido em campo único, 23503 = registro ainda é usado em outra tabela
function traduzirErroDoBanco(erro) {
  if (erro.code === '23505') return criarErro(409, 'E-mail ou carteirinha já cadastrados');
  if (erro.code === '23503') return criarErro(409, 'Doador tem consultas registradas e não pode ser excluído');
  return erro;
}

async function cadastrar(dados) {
  validar(dados);
  try {
    return await repository.criar(montarDoador(dados));
  } catch (erro) {
    throw traduzirErroDoBanco(erro);
  }
}

async function listar(filtros) {
  const disponivel = filtros.disponivel === undefined ? undefined : filtros.disponivel === 'true';
  return repository.listar(filtros.tipoSanguineo, disponivel);
}

async function buscarPorId(id) {
  const doador = await repository.buscarPorId(id);
  if (!doador) throw criarErro(404, 'Doador não encontrado');
  return doador;
}

async function atualizar(id, dados) {
  validar(dados);
  try {
    const doador = await repository.atualizar(id, montarDoador(dados));
    if (!doador) throw criarErro(404, 'Doador não encontrado');
    return doador;
  } catch (erro) {
    throw traduzirErroDoBanco(erro);
  }
}

async function mudarDisponibilidade(id, disponivel) {
  if (typeof disponivel !== 'boolean') {
    throw criarErro(400, 'Disponível deve ser true ou false');
  }
  const doador = await repository.atualizarDisponibilidade(id, disponivel);
  if (!doador) throw criarErro(404, 'Doador não encontrado');
  return doador;
}

async function excluir(id) {
  try {
    const apagou = await repository.excluir(id);
    if (!apagou) throw criarErro(404, 'Doador não encontrado');
  } catch (erro) {
    throw traduzirErroDoBanco(erro);
  }
}

module.exports = { cadastrar, listar, buscarPorId, atualizar, mudarDisponibilidade, excluir };
