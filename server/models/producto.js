const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio Unitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    unidadMedida: {
        type: String,
        required: [true, 'La unidad de medida es necesaria'],
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        required: [true, 'La cantidad es necesaria']
    },
    estado: {
        type: Boolean,
        default: true,
    },
    iva: {
        type: String,
        required: [true, 'El IVA es necesario']
    }
});


module.exports = mongoose.model('Producto', productoSchema);