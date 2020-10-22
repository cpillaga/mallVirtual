const express = require("express");
const mongoose = require('mongoose');
const compra = require("../models/compra");
const cors = require('cors');

let app = express();
const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

let DetalleCompra = require("../models/detalleCompra");

//=======================================
//mostrar todas los detalles de compras
//=======================================
app.get("/detalleCompra", verificaToken, (req, res) => {

    DetalleCompra.find({}, 'cantidad subtotal') //Lo que esta dentro de apostrofe son campos a mostrar
        .populate('producto')
        .populate('compra')
        .exec((err, detalle) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                detalle
            });
        });
});

//=====================================
//obtener detalle de compra por compra
//=====================================
app.get("/detalleCompra/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    DetalleCompra.find({ compra: id })
        .populate('compra', 'cantidad subtotal')
        .exec((err, detalleDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!detalleDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "el id no existe",
                    },
                });
            }
            res.json({
                ok: true,
                detalle: detalleDB,
            });
        });
});

//=====================================
//crear una nueva compra
//=====================================
app.post("/detalleCompra", verificaToken, (req, res) => {
    let body = req.body;
    let detalle = new DetalleCompra({
        cantidad: body.cantidad,
        producto: body.producto,
        subtotal: body.subtotal,
        compra: body.compra,
    });

    detalle.save((err, detalleBD) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            detalle: detalleBD,
        });
    });
});


app.put('/detalleCompra/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['cantidad', 'subtotal', 'producto', 'compra']);

    DetalleCompra.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, detalleDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            detalle: detalleDB
        });
    });
});


//=====================================
//borrar compra
//=====================================
app.delete("/detalleCompra/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    DetalleCompra.findByIdAndRemove(id, (err, detalleDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!detalleDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "el id no existe",
                },
            });
        }
        res.json({
            ok: true,
            mensaje: "detalle eliminado",
        });
    });
});

module.exports = app;