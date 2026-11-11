const express = require('express');
const path = require('path');
const doadorController = require('./controller/DoadorController');

const app = express();
app.use(express.json());

// rotas dos doadores
app.post('/api/doadores', doadorController.cadastrar);
app.get('/api/doadores', doadorController.listar);
app.get('/api/doadores/:id', doadorController.buscarPorId);
app.put('/api/doadores/:id', doadorController.atualizar);
app.patch('/api/doadores/:id/disponibilidade', doadorController.mudarDisponibilidade);
app.delete('/api/doadores/:id', doadorController.excluir);

// telas
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log('Servidor rodando em http://localhost:' + porta);
});
