const express = require("express");

let app = express();
const { verificaToken } = require('../middlewares/autenticacion');
const producto = require("../models/producto");

let Producto = require("../models/producto");

//=====================================
//mostrar todas las categorias
//=====================================

app.get("/productos/buscar/:empresa", verificaToken, (req, res) => {
    //traer todos los productos
    let empresaB = req.params.empresa;

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find()
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (productos.categoria.empresa._id = empresaB) {
                res.json({
                    ok: true,
                    productos,
                });
            }

        });

});

app.get("/productos-categoria/:id", verificaToken, (req, res) => {
    //traer todos los productos
    let id = req.params.id;

    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({
            categoria: id
        })
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
        stock: body.stock
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
    let body = req.body;

    Producto.findByIdAndUpdate(
        id, {
            new: true,
            runValidators: true,
        },
        (err, productoBD) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!productoBD) {
                res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "no existe el producto con este id en la base de datos",
                    },
                });
            }
            productoBD.nombre = body.nombre;
            productoBD.precioUni = body.precioUni;
            productoBD.descripcion = body.descripcion;
            productoBD.unidadMedida = body.unidadMedida;
            productoBD.stock = body.stock;
            (productoBD.img = body.img),
            (productoBD.categoria = body.categoria),
            productoBD.save((err, productoGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
                res.json({
                    ok: true,
                    producto: productoGuardado,
                });
            });
        }
    );
    //grabar el usuario
    //grabar una categoria del listado
});

//=====================================
//borrar producto
//=====================================

app.delete("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoDB) => {
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
            mensaje: "Producto eliminado",
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