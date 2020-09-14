const express = require('express');
const fs = require('fs');
const path = require('path');

let app = express();

app.get('/imagen/productos/:img', (req, res) => {
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/productos/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImg = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImg);
    }

});

module.exports = app;