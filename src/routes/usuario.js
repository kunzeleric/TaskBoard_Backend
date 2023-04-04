const express = require('express');
const connectDataBase = require('../middlewares/connectionDB');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const EsquemaUsuario = require('../models/usuario');
const router = express.Router();

router.post('/criar', connectDataBase, async function (req, res) {
  try {
    // #swagger.tags = ['Usuario']
    let { nome, email, senha } = req.body;
    const numeroVezesHash = 10;
    const senhaHash = await bcrypt.hash(senha, numeroVezesHash);
    const respostaBD = await EsquemaUsuario.create({ nome, email, senha: senhaHash });

    res.status(200).json({
      status: "OK",
      statusMessage: "Usuário criado com sucesso.",
      response: respostaBD
    })

  } catch (error) {
    if (String(error).includes("email_1 dup key")) {
      return tratarErrosEsperados(res, "Error: Já existe uma conta com este e-mail.");
    }
    return tratarErrosEsperados(res, error);
  }
});

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
