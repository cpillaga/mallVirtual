const jwt = require("jsonwebtoken");


const SEED = require('../config/config').SEED;

//===============================
//verifica token
//===============================

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token  no válido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};

//===============================
//verifica si el rol es administrador
//===============================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.rol === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

}

//===============================
//verifica token para imagen
//===============================

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "token no valido"
                }
            });
        }
        // req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
};