const service = require('../services/DoadorService');

// responde o erro com o status certo
function responderErro(erro, res) {
  if (erro.status) {
    return res.status(erro.status).json({ erro: erro.message });
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro no servidor' });
}

async function cadastrar(req, res) {
  try {
    const doador = await service.cadastrar(req.body);
    res.status(201).json(doador);
  } catch (erro) {
    responderErro(erro, res);
  }
}

async function listar(req, res) {
  try {
    const doadores = await service.listar(req.query);
    res.json(doadores);
  } catch (erro) {
    responderErro(erro, res);
  }
}

async function buscarPorId(req, res) {
  try {
    const doador = await service.buscarPorId(req.params.id);
    res.json(doador);
  } catch (erro) {
    responderErro(erro, res);
  }
}

async function atualizar(req, res) {
  try {
    const doador = await service.atualizar(req.params.id, req.body);
    res.json(doador);
  } catch (erro) {
    responderErro(erro, res);
  }
}

async function mudarDisponibilidade(req, res) {
  try {
    const doador = await service.mudarDisponibilidade(req.params.id, req.body.disponivel);
    res.json(doador);
  } catch (erro) {
    responderErro(erro, res);
  }
}

async function excluir(req, res) {
  try {
    await service.excluir(req.params.id);
    res.status(204).end();
  } catch (erro) {
    responderErro(erro, res);
  }
}

module.exports = { cadastrar, listar, buscarPorId, atualizar, mudarDisponibilidade, excluir };
