/* jshint esversion: 8 */
const express = require('express');
const app = express();

const fileUpload = require('express-fileupload');
const uniqid = require('uniqid');
const fs = require('fs');
const path = require('path');

const PubAdmin = require('../models/pubAdmin');
const PubEmp = require('../models/pubEmp');
const Producto = require('../models/producto');


const { verificaToken } = require('../middlewares/autenticacion');

app.use(fileUpload({ useTempFiles: true }));
const cors = require('cors');
app.use(cors({ origin: '*' }));

/**
 * 
 * Upload only imgs
 */
app.post('/upload/:type', [verificaToken], (req, res) => {

    let type = req.params.type;
    let id = req.user._id;

    if (!req.files) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: 'Bad Request'
        });
    }

    let validTypes = ['empresa', 'producto'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: 'Bad Request'
        });
    }

    let img = req.files.img;
    let imgName = img.name.split('.');
    let extension = imgName[imgName.length - 1];
    let extensionsAllowed = ['png', 'jpg', 'jpeg'];
    if (extensionsAllowed.indexOf(extension) < 0) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Solo se permiten archivos con extensiones ' + extensionsAllowed.join(', '),
            received: extension
        });
    }
    let fileName = `${id}-${uniqid('SHADOW')}.${extension}`;
    img.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                statusCode: 500,
                error: err
            });
        }
        empresaImg(id, res, fileName);
    });
});

/**
 * Upload with ID
 */
app.post('/uploads/:type/:idImg', [verificaToken], (req, res) => {

    let type = req.params.type;
    let id = req.params.idImg;

    console.log(type);
    if (!req.files) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: 'Bad Request'
        });
    }

    let validTypes = ['pubAdmin', 'pubEmp', 'producto'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: 'Bad Request'
        });
    }

    let img = req.files.img;
    let imgName = img.name.split('.');
    let extension = imgName[imgName.length - 1];
    let extensionsAllowed = ['png', 'jpg', 'jpeg'];
    if (extensionsAllowed.indexOf(extension) < 0) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Solo se permiten archivos con extensiones ' + extensionsAllowed.join(', '),
            received: extension
        });
    }
    let fileName = `${id}-${uniqid('MALL')}.${extension}`;
    console.log(`uploads/${type}/${fileName}`);
    img.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                statusCode: 500,
                error: err
            });
        }

        if (type === 'pubAdmin') {
            pubAdminImg(id, res, fileName);
        } else if (type === 'pubEmp') {
            pubEmpImg(id, res, fileName);
        } else {
            productoImg(id, res, fileName);
        }
    });
});


/**
 * 
 * @param {ID USUARIO} id 
 * @param {RESPONSE HTTP} res 
 * @param {FILE NAME} fileName 
 */
let productoImg = (id, res, fileName) => {
    Producto.findById({ _id: id }, (err, productoDB) => {
        if (err) {
            deleteImg(fileName, 'producto');
            return res.status(400).json({
                statusCode: 400,
                statusMessage: 'Bad Request'
            });
        }

        if (!productoDB) {
            if (err) {
                deleteImg(fileName, 'producto');
                return res.status(400).json({
                    statusCode: 400,
                    statusMessage: 'Bad Request'
                });
            }
        }
        deleteImg(productoDB.img, 'producto');
        productoDB.img = fileName;
        productoDB.save((err) => {
            if (err) {
                return res.status(400).json({
                    statusCode: 400,
                    statusMessage: 'Bad Request'
                });
            }
            return res.status(200).json({
                statusCode: 200,
                statusMessage: 'Successful',
                img: fileName
            });
        });
    });
};


/**
 * 
 * @param {ID USUARIO} id 
 * @param {RESPONSE HTTP} res 
 * @param {FILE NAME} fileName 
 */
let pubEmpImg = (id, res, fileName) => {
    PubEmp.findById({ _id: id }, (err, empresaDB) => {
        if (err) {
            deleteImg(fileName, 'pubEmp');
            return res.status(400).json({
                statusCode: 400,
                statusMessage: 'Bad Request'
            });
        }

        if (!empresaDB) {
            if (err) {
                deleteImg(fileName, 'pubEmp');
                return res.status(400).json({
                    statusCode: 400,
                    statusMessage: 'Bad Request'
                });
            }
        }
        deleteImg(empresaDB.img, 'pubEmp');
        empresaDB.img = fileName;
        empresaDB.save((err) => {
            if (err) {
                return res.status(400).json({
                    statusCode: 400,
                    statusMessage: 'Bad Request'
                });
            }
            return res.status(200).json({
                statusCode: 200,
                statusMessage: 'Successful',
                img: fileName
            });
        });
    });
};


/**
 * 
 * @param {ID USUARIO} id 
 * @param {RESPONSE HTTP} res 
 * @param {FILE NAME} fileName 
 */
let pubAdminImg = (id, res, fileName) => {
    PubAdmin.findById({ _id: id }, (err, empresaDB) => {
        if (err) {
            deleteImg(fileName, 'pubAdmin');
            return res.status(400).json({
                statusCode: 400,
                statusMessage: 'Bad Request'
            });
        }

        if (!empresaDB) {
            if (err) {
                deleteImg(fileName, 'pubAdmin');
                return res.status(400).json({
                    statusCode: 400,
                    statusMessage: 'Bad Request'
                });
            }
        }
        deleteImg(empresaDB.img, 'pubAdmin');
        empresaDB.img = fileName;
        empresaDB.save((err) => {
            if (err) {
                return res.status(400).json({
                    statusCode: 400,
                    statusMessage: 'Bad Request'
                });
            }
            return res.status(200).json({
                statusCode: 200,
                statusMessage: 'Successful',
                img: fileName
            });
        });
    });
};

/**
 * 
 * @param {IMG NAME} imgName 
 * @param {TYPE} type 
 */
let deleteImg = (imgName, type) => {
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${imgName}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
};

/**
 * 
 * Upload any file
 */
app.post('/imgEmpresa/any', (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: 'Bad Request'
        });
    }
    let img = req.files.img;

    img.mv('uploads/filename.jpg', (err) => {
        if (err) {
            return res.status(500).json({
                statusCode: 500,
                error: err
            });
        }
        return res.status(200).json({
            statusCode: 200,
            statusMessage: 'Successful'
        });
    });
});

app.get('/uploads/:type/:img', (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let imgPath = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    }
    // else {
    //     let defaultImg = path.resolve(__dirname, '../assets/avatar_simple.svg');
    //     res.sendFile(defaultImg);
    // }
});
module.exports = app;