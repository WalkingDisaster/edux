exports.init = function (io) {
    io.on('connect', function (socket) {
        var timeout = 15000;
        socket.on('run long running report', function () {
            socket.emit('notify', {
                message: 'Report Started'
            });
            new Promise(resolve => setTimeout(resolve, timeout))
                .then(() => socket.emit('notify', {
                    message: 'Report Ready'
                }));
        });
    });
};