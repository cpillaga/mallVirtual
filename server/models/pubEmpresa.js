const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let pubEmpSchema = new Schema({
    img: {
        type: String,
        required: false
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }

});


module.exports = mongoose.model('PubEmp', pubEmpSchema);