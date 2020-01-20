const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const routes = require('./routes');

const { setupWebsocket } = require('./websocket');

const app = express();
//servidor http fora do express
const server = http.Server(app);

setupWebsocket(server); //Assim a função é disparada quando o programa iniciar;

mongoose.connect('URL conexão do mongoDb atlas',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//express vai entender formato json
app.use(express.json());
app.use(routes);

server.listen(8080);


// TIPOS DE PARÂMETROS:
// Query Parans: request.query (filtros, ordenação, paginação, ...)
// Route Parans: request.parans (Indentificar um recurso na alteração ou remoção)
// Body: request.body (Dados para criação ou alteração de um registro)

//yarn add socket.io para fazer comunicação em tempo real com o front-end
//lembrar de deletar socket.io-client kkkkkk rs!