import socketio from 'socket.io-client';

const socket = socketio('ENDEREÇO DO BACKEND', {
    autoConnect = false,
});

// Ouvindo o evento que o back-end está disparando
function subscribeToNewDevs(subscribeFunction) {
    socket.on('new-dev', subscribeFunction);
}

function connect(latitude, longitued, techs) {
    socket.io.opts.query = {
        latitude,
        longitued,
        techs,
    }

    socket.connect();

    socket.on('message', text => {
        console.log(text);
    });
}

function disconnect() {
    if (socket.disconnected) {
        socket.disconnect();
    }
}

export {
    connect,
    disconnect
}