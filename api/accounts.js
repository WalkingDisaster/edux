var Rx = require('rxjs/Rx')

exports.userAdded = new Rx.Subject();
exports.userRemoved = new Rx.Subject();

exports.init = function (io) {
    var userAdded = this.userAdded;
    var userRemoved = this.userRemoved;

    var users = new Map();

    io.on('connection', function (socket) {
        var handshake = socket.handshake;
        var token = `${handshake.headers.cookie}-${handshake.address}`;

        socket.userToken = token;
        console.log(`Connection established with unique token ${socket.userToken}`);

        socket.on('login', function (userName) {
            console.log(`Login request received for user "${userName}"`)
            var error = false;

            if (users.has(userName)) {
                var expectedToken = users.get(userName);
                if (expectedToken !== token) {
                    // error
                    console.log(`User "${userName}" was already reserved by another socket. Expected token "${users.get(userName)}", but got "${token}"`)
                    error = true;
                }
            } else {
                users.set(userName, this.userToken);
                socket.userName = userName;
            }

            if (!error) {
                console.log(`Successfully logged in as "${userName}"`)
                // additional stuff
                // confirm connection
                userAdded.next(userName)
            }
        });
        socket.on('logout', function () {
            console.log(`Logout request received for user "${userName}"`)
            var userName = socket.userName;
            var userToken = socket.userToken;
            if (users.has(userName) && users.get(userName) === userToken) {
                users.delete(userName);
                console.log(`Successfully logged out of "${userName}"`)
                // additional stuff
                // confirm disconnection
                userRemoved.next(userName);
            }
        });
    });
};