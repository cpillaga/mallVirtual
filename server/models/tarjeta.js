const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let tarjetaSchema = new Schema({
    numero: {
        type: String,
        unique: true,
        required: [true, 'Eal número es obligatorio']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    mesVence: {
        type: String,
        required: [true, 'El mes es obligatorio']
    },
    anioVence: {
        type: String,
        required: [true, 'El año es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

tarjetaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Tarjeta', tarjetaSchema);