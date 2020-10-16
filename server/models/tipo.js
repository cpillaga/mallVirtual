const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let tipoSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción del tipo es necesaria']
    },
    icono: {
        type: String,
        required: [true, 'El ícono del tipo es necesaria']
    }
});

module.exports = mongoose.model('Tipo', tipoSchema);