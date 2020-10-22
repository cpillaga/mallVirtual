const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const cors = require('cors');
const Admin = require('../models/admin');

const SEED = require('../config/config').SEED;

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.use(cors({ origin: '*' }));

app.post('/admin/login', function(req, res) {
    let body = req.body;

    Admin.findOne({ correo: body.correo }, (err, adminDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Admin',
                errors: err
            });
        }

        if (!adminDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, adminDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }
        adminDB.password = 'null';

        var token = jwt.sign({ admin: adminDB }, SEED, { expiresIn: 28800 }); //8 horas

        res.json({
            ok: true,
            admin: adminDB,
            token: token,
            id: adminDB._id
        });

    });
});


app.post('/admin', function(req, res) {
    let body = req.body;

    let admin = new Admin({
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10)
    });

    admin.save((err, adminDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        adminDB.password = 'null';

        res.json({
            ok: true,
            admin: adminDB
        });
    });
});


app.put('/admin/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['password']);


    if (body.password != null) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    Admin.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, adminDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        adminDB.password = 'null';

        res.json({
            ok: true,
            admin: adminDB
        });
    });
});

module.exports = app;