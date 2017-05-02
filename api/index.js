const accountsModule = require('./accounts');
const chatModule = require('./chat');

// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

accountsModule.init(io);
chatModule.init(io);

accountsModule.userAdded.subscribe(user => console.log(`***via event: user "${user}" logged in`));
accountsModule.userRemoved.subscribe(user => console.log(`***via event: user "${user}" logged out`));