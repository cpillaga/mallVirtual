const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let detalleCompraSchema = new Schema({
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es necesaria'],
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    subtotal: {
        type: Number,
        required: [true, 'El subtotal es necesario'],
    },
    compra: {
        type: Schema.Types.ObjectId,
        ref: 'Compra',
        required: true
    }
});

module.exports = mongoose.model('DetalleCompra', detalleCompraSchema);