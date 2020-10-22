//=========================
//    Puerto
//=========================
process.env.PORT = process.env.PORT || 3000;

//=========================
//    Entorno
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================
//    Bsase de Datos
//=========================

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/mall';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=========================
//    Firma Token
//=========================

module.exports.SEED = 'firma-mallvirtual';