const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');


const connections = [];

exports.setupWebsocket = (server) => {
    const io = socketio(server);

    // ouvindo um usuario se conectar
    io.on('connection', soket => {
        const { latitude, longitude, techs } = soket.handshake.query;

        console.log(soket.id);
        console.log(soket.handshake.query);

        //Salvando todas as conexões que são feitas
        connections.push({
            id: soket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs)
        });

        //Envia uma menssagem para o front
        setTimeout(() => {
            soket.emit('messaeg', 'nué qui funciona')
        }, 8080);
    });
};


// Verifica se o dev esta nos 10 Km de distancia e se tem uma tch em comum
exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connections.techs.some(item => techs.includes(item))
    });
};

// envia a menssagem para o front
exports.sendMessage = (to, message, data) => {
    to.forEach(connections => {
        io.to(connection.id).emit(messgage, data)
    });
}
