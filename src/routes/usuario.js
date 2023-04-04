const express = require('express');
const connectDataBase = require('../middlewares/connectionDB');
const router = express.Router();

router.post('/criar', connectDataBase, function(req, res, next) {
  console.log('var:', process.env.TESTE);
  res.send('respond with a resource 50 var:' + process.env.TESTE );
});

module.exports = router;
