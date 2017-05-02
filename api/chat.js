exports.init = function (io) {
    var users = new Set();

    io.of('/chat').on('connection', function (socket) {
        // when the client emits 'new message', this listens and executes
        socket.on('new message', function (data) {
            // we tell the client to execute 'new message'
            socket.broadcast.emit('new message', {
                userName: socket.userName,
                message: data
            });
            socket.broadcast.emit('stop typing', {
                userName: socket.userName
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
}