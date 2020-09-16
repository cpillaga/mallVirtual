const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

let Usuario = require("../models/usuario");
const SEED = require('../config/config').SEED;
const cors = require('cors');

let app = express();

app.use(cors({ origin: '*' }));

app.post("/login", (req, res) => {
    let body = req.body;

    Usuario.findOne({
        correo: body.correo
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                },
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                },
            });
        }

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });
    });



});

module.exports = app;