const express = require('express');
const connectDataBase = require('../middlewares/connectionDB');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
const authUser = require('../middlewares/authUser');
const EsquemaTarefa = require('../models/tarefa');
const router = express.Router();

router.post('/criar', authUser, connectDataBase, async function (req, res) {
  try {
    // #swagger.tags = ['Tarefa']
    let { posicao, titulo, descricao, status, dataEntrega } = req.body;
    const usuarioCriador = req.usuarioJwt.id;
    const respostaBD = await EsquemaTarefa.create({ posicao, titulo, descricao, status, dataEntrega, usuarioCriador });

    res.status(200).json({
      status: "OK",
      statusMessage: "Tarefa criada com sucesso.",
      response: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});


module.exports = router;
