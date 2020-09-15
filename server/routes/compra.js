const express = require("express");
const mongoose = require('mongoose');
const compra = require("../models/compra");


let app = express();

let Compra = require("../models/compra");

//=======================================
//mostrar todas las compras
//=======================================
app.get("/compra", (req, res) => {
    let id = req.params.id;
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Compra.find()
        .populate({
            path: 'producto',
            populate: {
                path: 'categoria'
            }
        }).populate('usuario')
        .exec((err, compra) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                compra,
            });
        });
});

//=====================================
//obtener compra por usuario
//=====================================
app.get("/compra/:id", (req, res) => {
    let id = req.params.id;

    Compra.find({ usuario: id })
        .populate({
            path: 'producto',
            populate: {
                path: 'categoria'
            }
        })
        .exec((err, compraDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!compraDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "el id no existe",
                    },
                });
            }
            res.json({
                ok: true,
                compra: compraDB,
            });
        });
});

//=====================================
//crear una nueva compra
//=====================================
app.post("/compra", (req, res) => {
    let body = req.body;
    let compra = new Compra({
        cantidad: body.cantidad,
        producto: body.producto,
        subtotal: body.subtotal,
        subtotal12: body.subtotal12,
        iva: body.iva,
        descuento: body.descuento,
        total: body.total,
        usuario: body.usuario,
    });

    compra.save((err, compraBD) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            compra: compraBD,
        });
    });
});

//=====================================
//actualizar compra
//=====================================
app.put("/compra/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Compra.findByIdAndUpdate(
        id, {
            new: true,
            runValidators: true,
        },
        (err, compraBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!compraBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "no existe el compra con este id en la base de datos",
                    },
                });
            }
            compraBD.cantidad = body.cantidad;
            compraBD.producto = body.producto;
            compraBD.subtotal = body.subtotal;
            compraBD.subtotal12 = body.subtotal12;
            compraBD.descuento = body.descuento;
            compraBD.iva = body.iva;
            compraBD.total = body.total;

            compraBD.save((err, compraGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
                res.json({
                    ok: true,
                    compra: compraGuardado,
                });
            });
        }
    );
    //grabar el usuario
    //grabar una categoria del listado
});

//=====================================
//borrar compra
//=====================================
app.delete("/compra/:id", (req, res) => {
    let id = req.params.id;
    Compra.findByIdAndRemove(id, (err, compraDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!compraDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "el id no existe",
                },
            });
        }
        res.json({
            ok: true,
            mensaje: "compra eliminado",
        });
    });
});

module.exports = app;