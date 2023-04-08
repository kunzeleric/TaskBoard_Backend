const express = require('express');
const connectDataBase = require('../middlewares/connectionDB');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const EsquemaUsuario = require('../models/usuario');
const router = express.Router();


//rota para criar usuário
router.post('/criar', connectDataBase, async function (req, res) {
  try {
    // #swagger.tags = ['Usuario']
    let { nome, email, senha } = req.body; //inputa as informações de nome, email e senha dentro do corpo da requisição
    const numeroVezesHash = 10; //numero aleatório
    const senhaHash = await bcrypt.hash(senha, numeroVezesHash); //encripta a senha
    const respostaBD = await EsquemaUsuario.create({ nome, email, senha: senhaHash }); //cria o usuario baseado no Esquema Usuario definido do banco de dados

    res.status(200).json({
      status: "OK",
      statusMessage: "Usuário criado com sucesso.",
      response: respostaBD
    })

  } catch (error) {
    if (String(error).includes("email_1 dup key")) { //mensagem exibida padrão para caso o email seja duplicado
      return tratarErrosEsperados(res, "Error: Já existe uma conta com este e-mail.");
    }
    return tratarErrosEsperados(res, error);
  }
});


//rota para logar usuário
router.post('/logar', connectDataBase, async function (req, res) {
  try {
    // #swagger.tags = ['Usuario']
    let { email, senha } = req.body;

    const respostaBD = await EsquemaUsuario.findOne({ email }).select('+senha'); //seleciona o campo senha pois o campo tinha sido desabilitado no usuario (segurança)
    if (respostaBD) {

      let senhaCorreta = await bcrypt.compare(senha, respostaBD.senha);
      if (senhaCorreta) {

        let token = jwt.sign({ id: respostaBD._id }, process.env.JWT_SECRET, { expiresIn: '1d' }); //geração do token para utilizar no frontend

        res.header('x-auth-token', token);
        res.status(200).json({
          status: "OK",
          statusMessage: "Usuário autenticado com sucesso.",
          response: {"x-auth-token": token}
        });
      } else {
        throw new Error("Email ou senha incorreto(a).")
      }
    } else {
      throw new Error("Email ou senha incorreto(a).")
    }
  } catch (err) {
    return tratarErrosEsperados(res, err);
  }
});

module.exports = router;
