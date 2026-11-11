const pool = require('../banco/conexao');
const Doador = require('../model/Doador');

async function criar(doador) {
  const sql = `INSERT INTO doadores (nome, email, carteirinha, tipo_sanguineo, disponivel)
               VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const valores = [doador.nome, doador.email, doador.carteirinha, doador.tipoSanguineo, doador.disponivel];
  const resultado = await pool.query(sql, valores);
  return Doador.deLinha(resultado.rows[0]);
}

async function listar(tipoSanguineo, disponivel) {
  let sql = 'SELECT * FROM doadores WHERE 1 = 1';
  const valores = [];

  if (tipoSanguineo) {
    valores.push(tipoSanguineo);
    sql += ' AND tipo_sanguineo = $' + valores.length;
  }
  if (disponivel !== undefined) {
    valores.push(disponivel);
    sql += ' AND disponivel = $' + valores.length;
  }

  sql += ' ORDER BY nome';
  const resultado = await pool.query(sql, valores);
  return resultado.rows.map(Doador.deLinha);
}

async function buscarPorId(id) {
  const resultado = await pool.query('SELECT * FROM doadores WHERE id = $1', [id]);
  if (resultado.rows.length === 0) return null;
  return Doador.deLinha(resultado.rows[0]);
}

async function atualizar(id, doador) {
  const sql = `UPDATE doadores
               SET nome = $1, email = $2, carteirinha = $3, tipo_sanguineo = $4, disponivel = $5
               WHERE id = $6 RETURNING *`;
  const valores = [doador.nome, doador.email, doador.carteirinha, doador.tipoSanguineo, doador.disponivel, id];
  const resultado = await pool.query(sql, valores);
  if (resultado.rows.length === 0) return null;
  return Doador.deLinha(resultado.rows[0]);
}

async function atualizarDisponibilidade(id, disponivel) {
  const sql = 'UPDATE doadores SET disponivel = $1 WHERE id = $2 RETURNING *';
  const resultado = await pool.query(sql, [disponivel, id]);
  if (resultado.rows.length === 0) return null;
  return Doador.deLinha(resultado.rows[0]);
}

async function excluir(id) {
  const resultado = await pool.query('DELETE FROM doadores WHERE id = $1', [id]);
  return resultado.rowCount > 0;
}

module.exports = { criar, listar, buscarPorId, atualizar, atualizarDisponibilidade, excluir };
