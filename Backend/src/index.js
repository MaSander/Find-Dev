const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-iyold.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//express vai entender formato json
app.use(express.json());
app.use(routes);

app.listen(8080);


// TIPOS DE PARÂMETROS:
// Query Parans: request.query (filtros, ordenação, paginação, ...)
// Route Parans: request.parans (Indentificar um recurso na alteração ou remoção)
// Body: request.body (Dados para criação ou alteração de um registro)