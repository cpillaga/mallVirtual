const express = require("express");
const _ = require('underscore');

let app = express();

const { verificaToken } = require('../middlewares/autenticacion');

// const producto = require("../models/producto");

let PubEmp = require("../models/pubEmp");


app.get('/pubEmp/:emp', verificaToken, (req, res) => {

    let empresaB = req.params.emp;

    PubEmp.find({ empresa: empresaB })
        .exec((err, pubEmp) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                pubEmp
            });
        });
});


//=====================================
//crear una nueva publicidad
//=====================================

app.post("/pubEmp", verificaToken, (req, res) => {
    let body = req.body;
    let pubEmp = new PubEmp({
        img: body.img,
        empresa: body.empresa
    });

    pubEmp.save((err, pubEmpBD) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            pubEmp: pubEmpBD,
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