const express = require("express");
const _ = require('underscore');

let app = express();

const { verificaToken } = require('../middlewares/autenticacion');

// const producto = require("../models/producto");

let Favoritos = require("../models/favoritos");

app.get('/favoritos/:favoritos', verificaToken, (req, res) => {

    let usuarioB = req.params.usuario;

    Favoritos.find({ usuario: usuarioB })
        .populate('producto')
        .populate('usuario')
        .exec((err, favoritos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                favoritos
            });
        });
});


//=====================================
//crear una nueva publicidad
//=====================================

app.post("/favoritos", verificaToken, (req, res) => {
    let body = req.body;
    let favoritos = new Favoritos({
        producto: body.producto,
        usuario: body.usuario
    });

    favoritos.save((err, favoritosBD) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            favoritos: favoritosBD,
        });
    });
});

//=====================================
//borrar producto
//=====================================

app.delete("/favoritos/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    Favoritos.findByIdAndRemove(id, (err, favoritosBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!favoritosBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'favoritos no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            favoritos: favoritosBorrado
        });
    });

});

module.exports = app;