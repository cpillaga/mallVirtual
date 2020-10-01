const express = require('express');

let Direccion = require('../models/direccion');

let app = express();

const { verificaToken } = require('../middlewares/autenticacion');

//=====================================
//mostrar todas las categorias de una empresa
//=====================================

app.get('/direccion/:usuario', verificaToken, (req, res) => {

    let usuarioB = req.params.usuario;

    Direccion.find({ usuario: usuarioB })
        .populate('usuario')
        .exec((err, direccionDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                direccionDB
            });
        });
});

//=====================================
//mostrar una categoria por id.
//=====================================

app.get('/direccionId/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Direccion.findById(id, (err, direccionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!direccionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'el id no existe en la tabla direccion'
                }
            });
        }
        res.json({
            ok: true,
            direccion: direccionDB
        });
    });
});

//=====================================
//crear nueva categoria
//=====================================

app.post('/direccion', verificaToken, (req, res) => {
    let body = req.body;
    let direccion = new Direccion({
        numero: body.numero,
        nombre: body.nombre,
        mesVence: body.mesVence,
        anioVence: body.anioVence,
        usuario: body.usuario
    });

    direccion.save((err, direccionBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!direccionBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            direccion: direccionBD
        });
    });
});



app.put('/direccion/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['numero', 'nombre', 'mesVence', 'anioVence']);


    if (body.password != null) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    Direccion.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, direccionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            direccion: direccionDB
        });
    });
});

//=====================================
//eliminar nueva categoria
//=====================================

app.delete('/direccion/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Direccion.findByIdAndRemove(id, (err, direccionBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!direccionBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }
        res.json({
            ok: true,
            mensaje: 'direccion borrada'
        });
    });
});

module.exports = app;