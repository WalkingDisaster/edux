var Rx = require('rxjs/Rx')


exports.userAdded = new Rx.Subject();
exports.userRemoved = new Rx.Subject();

exports.init = function (io) {
    var userAdded = this.userAdded;
    var userRemoved = this.userRemoved;
    var logins = new Map();

    io.on('connection', function (socket) {
        var handshake = socket.handshake;
        var token = `${handshake.headers.cookie}-${handshake.address}`;

        socket.on('login', function (userName) {
            var error = false;

            if (logins.has(userName)) {
                var expectedToken = logins.get(userName);
                if (expectedToken !== token) {
                    // error
                    console.log(`User "${userName}" was already reserved by another socket. Expected token "${expectedToken}", but got "${token}"`)
                    error = true;
                }
            } else {
                logins.set(userName, {
                    token: token,
                    socket: socket
                });
                socket.userName = userName;
            }

            if (!error) {
                // additional stuff
                // confirm connection
                userAdded.next(userName)
            }
        });
        socket.on('logout', function () {
            var userName = socket.userName;
            if (logins.has(userName) && logins.get(userName).token === token) {
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