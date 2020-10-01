const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let direccionSchema = new Schema({
    principal: {
        type: String,
        unique: true,
        required: [true, 'La calle principal es obligatoria']
    },
    secundaria: {
        type: String,
        required: [true, 'La calle secundaria es obligatoria']
    },
    referencia: {
        type: String,
        required: [true, 'La referencia es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

direccionSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Direccion', direccionSchema);