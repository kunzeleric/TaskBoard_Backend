const mongooseToSwagger = require('mongoose-to-swagger');
const EsquemaUsuario = require('../src/models/usuario.js');
const swaggerAutoGen = require('swagger-autogen')({
    openapi: '3.0.0',
    language: 'pt-BR',
});

const outputFile = './swagger/swagger_output.json';
const endpointsFiles = ['./index.js', './src/routes.js'];

let doc = {
    info: {
        version: "1.0.0",
        title: "API da Task Board",
        description: "Documentação da API da Task Board."
    },
    servers:[
        {
            url: "http://localhost:4000/",
            description: "Servidor localhost."
        },
        {
            url: "https://taskbd-back.vercel.app/",
            description: "Servidor de produção."
        }
    ],
    consumes: ['application/json'],
    produces: ['application/json'],
    components: {
        schemas: {
            Usuario: mongooseToSwagger(EsquemaUsuario)
            //Tarefa: mongooseToSwagger(EsquemaTarefa),
        }
    }
}

swaggerAutoGen(outputFile, endpointsFiles, doc).then(() => {
    console.log("Documentação do Swagger gerada encontra-se no arquivo em: " + outputFile);
    if(process.env.NODE_ENV !== 'production'){
        require("../index.js");
    }
})