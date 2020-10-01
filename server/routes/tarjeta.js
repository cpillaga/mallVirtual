const express = require('express');

let Tarjeta = require('../models/tarjeta');

let app = express();

const { verificaToken } = require('../middlewares/autenticacion');

//=====================================
//mostrar todas las categorias de una empresa
//=====================================

app.get('/tarjeta/:usuario', verificaToken, (req, res) => {

    let usuarioB = req.params.usuario;

    Tarjeta.find({ usuario: usuarioB })
        .populate('usuario')
        .exec((err, tarjetaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                tarjetaDB
            });
        });
});

//=====================================
//mostrar una categoria por id.
//=====================================

app.get('/tarjeta/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Tarjeta.findById(id, (err, tarjetaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tarjetaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'el id no existe en la tabla tarjeta'
                }
            });
        }
        res.json({
            ok: true,
            tarjeta: tarjetaDB
        });
    });
});

//=====================================
//crear nueva categoria
//=====================================

app.post('/tarjeta', verificaToken, (req, res) => {
    let body = req.body;
    let tarjeta = new Tarjeta({
        numero: body.numero,
        nombre: body.nombre,
        mesVence: body.mesVence,
        anioVence: body.anioVence,
        usuario: body.usuario
    });

    tarjeta.save((err, tarjetaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tarjetaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            tarjeta: tarjetaBD
        });
    });
});



app.put('/tarjeta/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['numero', 'nombre', 'mesVence', 'anioVence']);


    if (body.password != null) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    Tarjeta.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, tarjetaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            tarjeta: tarjetaDB
        });
    });
});

//=====================================
//eliminar nueva categoria
//=====================================

app.delete('/tarjeta/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Tarjeta.findByIdAndRemove(id, (err, tarjetaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!tarjetaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }
        res.json({
            ok: true,
            mensaje: 'tarjeta borrada'
        });
    });
});

module.exports = app;