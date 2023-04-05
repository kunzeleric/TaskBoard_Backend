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

router.put('/editar/:id', authUser, connectDataBase, async function (req, res) {
  try {
    // #swagger.tags = ['Tarefa']
    let idTarefa = req.params.id; //coleta o ID da URL
    let { posicao, titulo, descricao, status, dataEntrega } = req.body;
    const usuarioLogado = req.usuarioJwt.id;

    const checkTarefa = await EsquemaTarefa.findOne({ _id: idTarefa, usuarioCriador: usuarioLogado });
    if(!checkTarefa){
      throw new Error("Tarefa não encontrada ou pertence a outro usuário!")
    }

    const tarefaAtualizada = await EsquemaTarefa.updateOne({ _id: idTarefa }, { posicao, titulo, descricao, status, dataEntrega });
    if(tarefaAtualizada?.modifiedCount>0){
      const dadosTarefa = await EsquemaTarefa.findOne({ _id: idTarefa }).populate('usuarioCriador');

      res.status(200).json({
        status: "OK",
        statusMessage: "Tarefa atualizada com sucesso.",
        response: dadosTarefa
      })
    }

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.get('/obter/usuario', authUser, connectDataBase, async function (req, res) {
  try {
    // #swagger.tags = ['Tarefa']
    // #swagger.description = ['Endpoint para obter tarefas do usuário logado.']

    const usuarioLogado = req.usuarioJwt.id;
    const respostaBD = await EsquemaTarefa.find({ usuarioCriador: usuarioLogado }).populate('usuarioCriador'); //metodo find traz todas tarefas referentes ao usuario logado

    res.status(200).json({
      status: "OK",
      statusMessage: "Tarefas listadas na resposta com sucesso.",
      response: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.delete('/deletar/:id', authUser, connectDataBase, async function (req, res) {
  try {
    // #swagger.tags = ['Tarefa']
    let idTarefa = req.params.id; //coleta o ID da URL
    const usuarioLogado = req.usuarioJwt.id;
    
    const checkTarefa = await EsquemaTarefa.findOne({ _id: idTarefa, usuarioCriador: usuarioLogado });
    if(!checkTarefa){
      throw new Error("Tarefa não encontrada ou pertence a outro usuário!")
    }

    const respostaBD = await EsquemaTarefa.deleteOne({ _id: idTarefa });

    res.status(200).json({
      status: "OK",
      statusMessage: "Tarefa deletada com sucesso.",
      response: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});



module.exports = router;
