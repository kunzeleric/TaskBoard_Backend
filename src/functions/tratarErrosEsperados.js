const S = require('string');

function tratarErrosEsperados(res, err){

    // entrar quando o mongoose der algum erro
    if(String(err).includes('ValidationError:')){
        return res.status(400).json({
            status: "Erro",
            statusMessage: S(String(err).replace("ValidationError: ", "")).replaceAll(':', '').s,
            response: String(err)
        });
    }
    // pode ser um erro definido manualmente por mim
    if(String(err).includes('Error:')){
        return res.status(400).json({
            status: "Erro",
            statusMessage: S(String(err).replace("Error: ", "")),
            response: String(err)
        });
    }

    // Erro inesperado
    console.error(err);
    return res.status(500).json({
        status: "Erro",
        statusMessage: "Houve um problema inesperado, tente novamente mais tarde.",
        response: String(err)
    });
}

module.exports = tratarErrosEsperados;