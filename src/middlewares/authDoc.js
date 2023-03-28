async function authDocProducao(req, res, next) {
    const { senhaDigitada } = req.body;

    if(req.headers.host.includes('localhost') || req.originalUrl !== "/doc/"){
        //usuario está no localhost
        return next();
    }

    if(senhaDigitada === process.env.SWAGGER_SENHA_DOC){
        //usuario digitou a senha certa
        return next();
    }

    if(senhaDigitada){
        //usuario não digitou a senha certa
        res.status(401).set('Content-Type', 'text/html');
        res.send(Buffer.from(`
            <form method="post">
                <p style="color: red;">Senha incorreta.</p>
                <label for="senhaDigitada">Senha da Documentação</label>
                <input type="password" id="senhaDigitada" name="senhaDigitada" placeholder="Digite sua senha"/>
                <button type="submit">Entrar</button>
            </form>
        `))
    }
    else{
        //usuario ainda não digitou senha e está no modo produção
        res.status(200).set('Content-Type', 'text/html');
        res.send(Buffer.from(`
            <form method="post">
                <label for="senhaDigitada">Senha da Documentação</label>
                <input type="password" id="senhaDigitada" name="senhaDigitada" placeholder="Digite sua senha"/>
                <button type="submit">Entrar</button>
            </form>
        `))
    }
}

module.exports = authDocProducao;