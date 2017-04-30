// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var users = new Set();

io.on('connection', function (socket) {
    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            userName: socket.userName,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (userName) {
        if (!users.has(userName)) {
            users.add(userName);
            console.log(`User ${userName} logged in.`)
        }

        // we store the userName in the socket session for this client
        socket.userName = userName;
        socket.emit('login', {
            users: Array.from(users)
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            userName: socket.userName
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            userName: socket.userName
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            userName: socket.userName
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        users.delete(socket.userName);

        // echo globally that this client has left
        socket.broadcast.emit('user left', {
            userName: socket.userName
        });
    });
});