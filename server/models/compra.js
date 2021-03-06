const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let compraSchema = new Schema({
    subtotal: {
        type: Number,
        required: [true, 'El subtotal es necesario']
    },
    subtotal12: {
        type: Number,
        required: [true, 'El subtotal12 es necesario']
    },
    iva: {
        type: Number,
        required: [true, 'El iva es necesario']
    },
    descuento: {
        type: Number,
        required: [true, 'El descuento es necesario']
    },
    total: {
        type: Number,
        required: [true, 'El total es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

module.exports = mongoose.model('Compra', compraSchema);