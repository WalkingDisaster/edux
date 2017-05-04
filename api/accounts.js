var Rx = require('rxjs/Rx')


exports.userAdded = new Rx.Subject();
exports.userRemoved = new Rx.Subject();

exports.init = function (io) {
    var userAdded = this.userAdded;
    var userRemoved = this.userRemoved;
    var logins = new Map();

    io.on('connection', function (socket) {
        if (!socket.token) {
            socket.token = `${socket.client.id}-${socket.handshake.address}`;
            console.info(`Assigning token "${socket.token}" to this socket.`);
        }
        socket.emit('token acquired', socket.token);

        socket
            .on('login', function (data) {
                var error = false;

                var userName = data.userName;
                var gotToken = data.token;

                if (logins.has(userName)) {
                    var expectedToken = logins.get(userName).token;
                    if (expectedToken !== gotToken) {
                        // error
                        console.warn(`User "${userName}" was already reserved by another socket. Expected token "${expectedToken}", but got "${gotToken}"`)
                        error = true;
                    }
                } else {
                    console.info(`User "${userName}" got token "${socket.token}"`);
                    logins.set(userName, {
                        token: socket.token,
                        socket: socket
                    });
                    socket.userName = userName;
                }

                if (!error) {
                    // additional stuff
                    // confirm connection
                    userAdded.next(userName)
                }
            })
            .on('disconnect', function () {
                var userName = socket.userName;
                if (logins.has(userName)) {
                    console.info(`User "${userName}" disconnected.`);
                    logins.delete(userName);
                    userRemoved.next(userName);
                }
            })
            .on('logout', function () {
                var userName = socket.userName;
                if (logins.has(userName) && logins.get(userName).token === socket.token) {
                    console.info(`Logging user "${userName}" out. Token "${socket.token}" no longer needed.`)
                    logins.delete(userName);
                    // additional stuff
                    // confirm disconnection
                    userRemoved.next(userName);
                }
            });
    });
    return logins;
};

exports.notify = function (userName, message, logins) {
    if (!logins.has(userName)) {
        console.log(`User ${userName} was not found`);
        return;
    }
    var socket = logins.get(userName).socket;
    socket.emit('notify', {
        message: message
    });
}

exports.notifyAll = function (io, message, logins) {
    io.sockets.emit('notify', {
        message: message
    });
}

exports.notifyOthers = function (io, userName, message, logins) {
    if (!logins.has(userName)) {
        io.sockets.emit('notify', {
            message: message
        });
        return;
    }
    var socket = logins.get(userName).socket;
    socket.broadcast('notify', {
        message: message
    });
}