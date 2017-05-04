const accountsModule = require('./accounts');
const chatModule = require('./chat');
const reportsModule = require('./reports');
const supportRequestModule = require('./support');

// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var logins = accountsModule.init(io);
chatModule.init(io);

accountsModule.userAdded.subscribe(user => console.log(`***via event: user "${user}" logged in`));
accountsModule.userRemoved.subscribe(user => {
    //accountsModule.notifyAll(io, `The user ${user} has logged out.`, logins);
    accountsModule.notifyOthers(io, user, `The user ${user} has logged out.`, logins);
});

reportsModule.init(io);
supportRequestModule.init(io);