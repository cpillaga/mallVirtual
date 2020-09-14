const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const _ = require('underscore');
const SEED = require('../config/config').SEED;

const Empresa = require('../models/empresa');

let app = express();
const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

app.post('/empresa/login', function(req, res) {
    let body = req.body;

    Empresa.findOne({ correo: body.correo }, (err, empresaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al listar Empresa',
                errors: err
            });
        }

        if (!empresaDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, empresaDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        //Crear un token!!

        empresaDB.password = 'null';

        var token = jwt.sign({ empresa: empresaDB }, SEED, { expiresIn: 14400 }); //4 horas

        res.json({
            ok: true,
            empresa: empresaDB,
            token: token,
            id: empresaDB._id
        });

    });
});

app.get('/empresa', verificaToken, (req, res) => {
    // console.log("Entro al metodo");
    Empresa.find({ estado: true }, 'ruc razonSocial representante direccion telefono correo') //Lo que esta dentro de apostrofe son campos a mostrar
        .populate('tipo')
        .exec((err, empresa) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                empresa
            });
        });
});


/*
    Buscar empresa por razonSocial
*/
app.get('/empresa/buscar/:razon', verificaToken, function(req, res) {

    let razonB = req.params.razon;
    let regex = new RegExp(razonB, 'i');

    Empresa.find({ razonSocial: regex }, 'ruc razonSocial correo telefono direccion representante')
        .populate('tipo')
        .exec((err, empresa) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                empresa
            });
        });
});

app.post('/empresa', verificaToken, function(req, res) {
    let body = req.body;

    let empresa = new Empresa({
        ruc: body.ruc,
        razonSocial: body.razonSocial,
        representante: body.representante,
        direccion: body.direccion,
        telefono: body.telefono,
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10),
        tipo: body.tipo
    });

    empresa.save((err, empresaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            empresa: empresaDB
        });
    });
});


app.put('/empresa/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['ruc', 'razonSocial', 'representante', 'telefono', 'correo', 'password', 'tipo']);


    if (body.password != null) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    Empresa.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, empresaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        empresaDB.password = 'null';

        res.json({
            ok: true,
            empresa: empresaDB
        });
    });
});


app.delete('/empresa/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Empresa.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, empresaBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!empresaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        empresaBorrado.password = null;

        res.json({
            ok: true,
            empresa: empresaBorrado
        });
    });
});

module.exports = app;