const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let favoritosSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

module.exports = mongoose.model('Favoritos', favoritosSchema);