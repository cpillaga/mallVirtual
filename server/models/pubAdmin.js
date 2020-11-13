const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let pubAdminSchema = new Schema({

    img: {
        type: String,
        required: false
    },

});


module.exports = mongoose.model('PubAdmin', pubAdminSchema);