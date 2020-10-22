const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let carritoSchema = new Schema({
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
        required: [true, 'El subtotal es necesario']
    },
    // iva: {
    //     type: Number,
    //     required: [true, 'El iva es necesario']
    // },
    // descuento: {
    //     type: Number,
    //     required: [true, 'El descuento es necesario']
    // },
    // total: {
    //     type: Number,
    //     required: [true, 'El total es necesario']
    // },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


module.exports = mongoose.model('Carrito', carritoSchema);