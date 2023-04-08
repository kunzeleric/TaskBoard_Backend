const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); //chamando o cors
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = { customCssUrl: '/swagger-ui.css' };
const routes = require('./src/routes');
const authDocProducao = require('./src/middlewares/authDoc');
const app = express();
require('dotenv').config(); //chamando e configurando o dotenv para utilizar variáveis de ambiente (environment)

//configurando o express e outros
app.use(cors()); //utilizado para evitar problemas de CORS (integração de backend com frontend)
app.use(logger('dev')); //utilizando o dev para startar o comando no package json (npm start dev)
app.use(express.json()); //configura express para responder em JSON
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//configuração do swagger
if (process.env.NODE_ENV !== 'test') { //se o ambiente não for teste, ele documenta e salva o arquivo
    const swaggerFile = require('./swagger/swagger_output.json');
    app.get('/', (req, res) => {  /*#swagger.ignore = true*/ res.redirect('/doc'); });
    app.use('/doc', authDocProducao, swaggerUi.serve, swaggerUi.setup(swaggerFile, swaggerOptions));
}

//rotas api
routes(app);

//inicializando servidor
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}.`));
}

module.exports = app;
