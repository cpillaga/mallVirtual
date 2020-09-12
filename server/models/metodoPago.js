const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let metodoSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción del método de pago es necesaria']
    },
    total: {
        type: Number,
        unique: true,
        required: [true, 'La cantidad es necesaria']
    },
    carrito: {
        type: Schema.Types.ObjectId,
        ref: 'Carrito',
        required: [true, 'El carrito es obligatorio']
    }
});

module.exports = mongoose.model('Metodo', metodoSchema);