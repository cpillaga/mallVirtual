const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let empresaSchema = new Schema({
    ruc: {
        type: String,
        unique: true,
        required: [true, 'El ruc es obligatorio']
    },
    razonSocial: {
        type: String,
        required: [true, 'La razón social es obligatoria']
    },
    representante: {
        type: String,
        required: [true, 'El representante es obligatorio']
    },
    direccion: {
        type: String,
        required: [true, 'La direccion es obligatoria']
    },
    telefono: {
        type: String,
        required: [true, 'El telefono es obligatorio']
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    estado: {
        type: String,
        default: 'true'
    },
    tipo: {
        type: Schema.Types.ObjectId,
        ref: 'Tipo',
        required: [true, 'El tipo es obligatorio']
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria']
    }
});

empresaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Empresa', empresaSchema);