const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require('cors');
const fcm = require('../utils/fcm-managment');

let app = express();
const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));


let Usuario = require("../models/usuario");

//=====================================
//mostrar todos los usuarios
//=====================================

app.get("/usuarios", verificaToken, (req, res) => {
    //traer todos los usuarios

    Usuario.find().exec((err, usuarios) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            usuarios,
        });
    });
});

//=====================================
//obtener un usuario por id
//=====================================

app.get("/usuarios/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Usuario.findById(id).exec((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "el id no existe",
                },
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
        });
    });
});

//=====================================
//crear un nuevo usuario
//=====================================

app.post("/usuarios", (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10),
        facebook: body.facebook,
    });

    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioBD,
        });
    });
});

// =====================================
// Buscar un usuario x correo
// =====================================
app.get("/usuarios/buscar/:termino", (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, "i");
    Usuario.find({
        correo: regex,
    }).exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (usuarios.length <= 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "el usuario no existe",
                },
            });
        }

        res.json({
            ok: true,
            usuarios,
        });
    });
});

//=====================================
//actualizar usuario.
//=====================================

app.put("/usuarios/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findByIdAndUpdate(
        id, {
            new: true,
            runValidators: true,
        },
        (err, usuarioBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!usuarioBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "no existe el usuario con este id en la base de datos",
                    },
                });
            }
            usuarioBD.nombre = body.nombre;
            usuarioBD.correo = body.correo;
            usuarioBD.password = bcrypt.hashSync(body.password, 10);

            usuarioBD.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                });
            });
        }
    );
    // grabar el usuario
    // grabar una categoria del listado
});
//=====================================
//actualizar usuario sin password
//=====================================
app.put("/usuarios-sin-password/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findByIdAndUpdate(
        id, {
            new: true,
            runValidators: true,
        },
        (err, usuarioBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!usuarioBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "no existe el usuario con este id en la base de datos",
                    },
                });
            }
            usuarioBD.nombre = body.nombre;
            usuarioBD.correo = body.correo;
            // usuarioBD.password = bcrypt.hashSync(body.password, 10);

            usuarioBD.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                });
            });
        }
    );
    // grabar el usuario
    // grabar una categoria del listado
});

/**
 * ADD TOKEN TO USER
 */
app.post('/user/FCM', verificaToken, (req, res) => {
    let id = req.usuario._id;
    let body = req.body;
    let fcm = body.fcm;
    Usuario.findById(id, (err, userDB) => {
        if (err) {
            return res.status(400).send({
                statusMessage: 'Bad Request',
                error: err
            });
        }
        
        if (!userDB.fcm.includes(fcm)) {
            console.log('object includes'); 
            userDB.fcm.push(fcm);
            userDB.save((err, userDBUpdated) => {
                if (err) {
                    return res.status(400).send({
                        statusMessage: 'Bad Request',
                        error: err
                    });
                }
                return res.status(200).send({
                        statusMessage: 'Successful',
                        user: userDBUpdated
                });
            });
        } else {
            return res.status(409).send({
                    statusMessage: 'Conflict',
                    message: 'Token User Already Exists',
            });
        }
    });
});

/**
 * DELETE FCM TOKEN
 */
// DELETE TOKEN AFTER CLOSE SESSION ON FRONT END
app.delete('/user/fcm/:token', verificaToken, (req, res) => {
    let token = req.params.token;
    let id = req.usuario._id;
    Usuario.findById(id, (err, userDB) => {
        if (err) {
            return res.status(400).send({
                statusMessage: 'Bad Request',
                error: err
            });
        }
        userDB.fcm.pull(token);
        userDB.save((err) => {
            if (err) {
                return res.status(400).send({
                    statusMessage: 'Bad Request',
                    error: err
                });
            }
            return res.status(200).send({
                    statusMessage: 'Successful',
                    message: 'Token Deleted',
                    token
            });
        });
    });
});

/**
 * SEND NOTIFICATIONS
 */
// Single
app.post('/user/sendNotification', verificaToken, (req, res) => {
    let id = req.usuario._id;
    Usuario.findById(id, (err, userDB) => {
        if (err) {
            return res.status(400).send({
                statusMessage: 'Bad Request',
                error: err
            });
        }
        fcm.userNotification(
            userDB.fcm,
            'TITLE NOTIFICATION',
            'CONTENT NOTIFICATION',
            {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                type: 'USER_NOTIFICATION',
                // ANY DATA TO SEND THROUGH NOTIFICATIONS 
            }
        );
        return res.status(200).send({
                statusMessage: 'Successful',
                message: 'Notification Sent'
        });
    });
});

// Broadcast
app.post('/users/sendNotification', verificaToken, (req, res) => {
    let body = req.body;
    let topic = body.token;
    fcm.userBroadcastNotification(
        topic,
        'TITLE NOTIFICATION',
        'CONTENT NOTIFICATION',
        {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            type: 'USER_NOTIFICATION',
            // ANY DATA TO SEND THROUGH NOTIFICATIONS 
        }
    );
    return res.status(200).send({
            statusMessage: 'Successful',
            message: 'Notification Sent'
    });
});
//=====================================
//borrar carrito
//=====================================

// app.delete("/carritos/:id", (req, res) => {
//     let id = req.params.id;
//     Carrito.findByIdAndRemove(id, (err, carritoDB) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err,
//             });
//         }
//         if (!carritoDB) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     mensaje: "el id no existe",
//                 },
//             });
//         }
//         res.json({
//             ok: true,
//             mensaje: "Carrito eliminado",
//         });
//     });
// });
//=====================================
//borrar todos los carritos
//=====================================

// app.delete("/carritos", (req, res) => {
//     Carrito.remove((err, carritoDB) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err,
//             });
//         }
//         if (!carritoDB) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     mensaje: "el id no existe",
//                 },
//             });
//         }
//         res.json({
//             ok: true,
//             mensaje: "Carritos eliminado",
//         });
//     });
// });
//=====================================
//borrar carrito x producto
//=====================================

// app.delete("/carritos/buscar/:id", (req, res) => {
//     let id = req.params.id;
//     Carrito.findOneAndRemove({
//         'producto': id
//     }, (err, carritoDB) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err,
//             });
//         }
//         if (!carritoDB) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     mensaje: "el id no existe",
//                 },
//             });
//         }
//         res.json({
//             ok: true,
//             mensaje: "Carrito eliminado",
//         });
//     });
// });

// =====================================
// Buscar un carrito x producto
// =====================================

// app.get("/carritos/buscar/:termino", (req, res) => {
//     let termino = req.params.termino;
//     Carrito.find({
//             'producto': termino,
//         }).populate({
//             path: 'producto',
//             populate: {
//                 path: 'categoria'
//             }
//         })
//         .exec((err, productos) => {
//             if (err) {
//                 res.status(500).json({
//                     ok: false,
//                     err,
//                 });
//             }

//             res.json({
//                 ok: true,
//                 productos,
//             });
//         });
// });
//=====================================
//Sumar un producto
//=====================================

// app.get("/carritos-suma", (req, res) => {
//     console.log(res.json);
//     Carrito.aggregate([{
//         $group: {
//             _id: {},
//             total: {
//                 $sum: {
//                     $multiply: ["$subtotal", "$cantidad"]
//                 }
//             }
//         }
//     }]).exec((err, total) => {
//         if (err) {
//             res.status(500).json({
//                 ok: false,
//                 err,
//             });
//         }
//         res.json({
//             ok: true,
//             total,
//         });
//     });

// });
//=====================================
//Contar productos del carrito
//=====================================

// app.get("/carritos-count", (req, res) => {
//     console.log(res.json);
//     Carrito.count().exec((err, total) => {
//         if (err) {
//             res.status(500).json({
//                 ok: false,
//                 err,
//             });
//         }
//         res.json({
//             ok: true,
//             total,
//         });
//     });

// });

//=====================================
//Filtrar un producto
//=====================================

// app.get("/productos/buscar/:termino", (req, res) => {
//     let termino = req.params.termino;
//     let regex = new RegExp(termino, "i");
//     Producto.find({
//             nombre: regex,
//         })
//         .sort("nombre")
//         .populate('categoria', 'descripcion')
//         .exec((err, productos) => {
//             if (err) {
//                 res.status(500).json({
//                     ok: false,
//                     err,
//                 });
//             }

//             res.json({
//                 ok: true,
//                 productos,
//             });
//         });
// });

module.exports = app;