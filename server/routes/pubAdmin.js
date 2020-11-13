const express = require("express");
const _ = require('underscore');

let app = express();

const { verificaToken } = require('../middlewares/autenticacion');

// const producto = require("../models/producto");

let PubAdmin = require("../models/pubAdmin");


app.get('/pubAdmin', verificaToken, (req, res) => {

    let empresaB = req.params.empresa;

    PubAdmin.find({})
        .exec((err, pubAdmin) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                pubAdmin
            });
        });
});


//=====================================
//crear una nueva publicidad
//=====================================

app.post("/pubAdmin", verificaToken, (req, res) => {
    let body = req.body;
    let pubAdmin = new PubAdmin({
        img: body.img,

    });

    pubAdmin.save((err, pubAdminBD) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            pubAdmin: pubAdminBD,
        });
    });
});

// //=====================================
// //borrar producto
// //=====================================

// app.delete("/productos/:id", verificaToken, (req, res) => {
//     let id = req.params.id;

//     let cambiaEstado = {
//         estado: false
//     };

//     Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }

//         if (!productoBorrado) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Producto no encontrada'
//                 }
//             });
//         }

//         productoBorrado.password = null;

//         res.json({
//             ok: true,
//             producto: productoBorrado
//         });
//     });

// });

module.exports = app;