require('./assets/styles/main.scss');

const io = require('socket.io-client');

const {Elm} = require('./elm/Main.elm');
const app = Elm.Main.init({
    node: document.getElementById('elm-node')
});

app.ports.createSocket.subscribe(() => {
    const socket = io('http://localhost:8082');

    socket.on('game_created', (game) => {
        console.log('Game received', game);
        app.ports.newGame.send(game);
    });
});
