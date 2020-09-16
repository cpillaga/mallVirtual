const express = require("express");
const _ = require('underscore');

let app = express();

const { verificaToken } = require('../middlewares/autenticacion');

// const producto = require("../models/producto");

let Producto = require("../models/producto");

//=====================================
//mostrar todas las categorias
//=====================================

app.get("/productos/emp/:empresa", verificaToken, (req, res) => {
    //traer todos los productos
    let empresaB = req.params.empresa;

    Producto.find({ estado: true })
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err,
                });
            }

            let tam = productos.length;
            let arreglo = Producto;
            let conta = 0;

            for (let i = 0; i < tam; i++) {
                if (empresaB == productos[i].categoria.empresa) {
                    arreglo[conta] = productos[i];
                    conta = conta + 1;
                }
            }


            res.json({
                ok: true,
                productos: arreglo
            });
        });
});

app.get("/productos-categoria/:id", verificaToken, (req, res) => {
    //traer todos los productos
    let id = req.params.id;

    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ categoria: id, estado: true })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                productos,
            });
        });
});

//=====================================
//obtener un producto por id
//=====================================

app.get("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "el id no existe",
                    },
                });
            }
            res.json({
                ok: true,
                producto: productoDB,
            });
        });
});

//=====================================
//crear un nuevo producto
//=====================================

app.post("/productos", verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        unidadMedida: body.unidadMedida,
        img: body.img,
        categoria: body.categoria,
        stock: body.stock,
        iva: body.iva
    });

    producto.save((err, productoBD) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoBD,
        });
    });
});

//=====================================
//actualizar producto
//=====================================
app.put("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'unidadMedida', 'img', 'categoria', 'stock', 'iva']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//=====================================
//borrar producto
//=====================================

app.delete("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }
            });
        }

        productoBorrado.password = null;

        res.json({
            ok: true,
            producto: productoBorrado
        });
    });

});

//=====================================
//Filtrar un producto
//=====================================

app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, "i");
    Producto.find({
            nombre: regex,
            estado: true
        })
        .sort("nombre")
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                productos,
            });
        });
});

module.exports = app;