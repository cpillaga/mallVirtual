const express = require('express');

let Pago = require('../models/metodoPago');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

//=====================================
//mostrar todas las categorias
//=====================================

app.get('/pago', (req, res) => {
    Pago.find({}, 'descripcion total') //Lo que esta dentro de apostrofe son campos a mostrar
        .populate('carrito', 'producto')
        .exec((err, pago) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                pago
            });
        });
});

//=====================================
//crear nuevo metodo pago
//=====================================

app.post('/pago', (req, res) => {
    let body = req.body;
    let pago = new Pago({
        descripcion: body.descripcion,
        total: body.total,
        carrito: body.carrito
    });

    pago.save((err, pagoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!pagoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            pago: pagoBD
        });
    });
});

//=====================================
//actualizar nueva pago
//=====================================

app.put('/pago/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion', 'total']);

    Pago.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, pagoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        pagoDB.password = 'null';

        res.json({
            ok: true,
            pago: pagoDB
        });
    });
});


module.exports = app;