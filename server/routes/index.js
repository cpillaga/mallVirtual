const express = require('express');

const app = express();

app.use(require('./admin'));
app.use(require('./empresa'));
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./carrito'));
app.use(require('./upload'));
app.use(require('./imagenes'));
app.use(require('./metodoPago'));

module.exports = app;