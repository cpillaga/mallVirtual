const express = require('express');

let Tipo = require('../models/tipo');

let app = express();

const { verificaToken } = require('../middlewares/autenticacion');

//=====================================
//mostrar todas las tipos
//=====================================

app.get('/tipo', verificaToken, (req, res) => {
    Tipo.find({})
        .sort('descripcion')
        .exec((err, tipo) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                tipo
            });
        });
});

//=====================================
//mostrar un tipo por id.
//=====================================

app.get('/tipo/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Tipo.findById(id, (err, tipoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tipoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'el id no existe en la tabla tipo'
                }
            });
        }
        res.json({
            ok: true,
            tipo: tipoDB
        });
    });
});

//=====================================
//crear nueva tipo
//=====================================

app.post('/tipo', verificaToken, (req, res) => {
    let body = req.body;
    let tipo = new Tipo({
        descripcion: body.descripcion
    });

    tipo.save((err, tipoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tipoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            tipo: tipoBD
        });
    });
});

//=====================================
//actualizar nueva tipo
//=====================================

app.put('/tipo/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Tipo.findByIdAndUpdate(id, descCategoria, {
        new: true,
        runValidators: true
    }, (err, tipoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!tipoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            tipo: tipoBD
        });
    });

});

//=====================================
//eliminar nueva tipo
//=====================================

app.delete('/tipo/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Tipo.findByIdAndRemove(id, (err, tipoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!tipoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }
        res.json({
            ok: true,
            mensaje: 'tipo borrada'
        });
    });
});

//=====================================
//Filtrar una tipo
//=====================================
app.get('/tipo/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Tipo.find({
            descripcion: regex
        })
        .sort('descripcion')
        .exec((err, tipo) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                tipo
            });
        });
});

module.exports = app;