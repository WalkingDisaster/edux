exports.init = function (io) {
    var lastId = 0;
    var items = [{
            id: ++lastId,
            recorded: new Date(),
            recordedBy: 'WalkingDisaster',
            title: 'Support Request 1',
            description: 'The first support request',
            assignedTo: null,
            changeHistory: [{
                changeTime: new Date(),
                changedBy: 'WalkingDisaster',
                changedTo: 'Identified',
                comments: null
            }]
        },
        {
            id: ++lastId,
            recorded: new Date(),
            recordedBy: 'WalkingDisaster',
            title: 'Support Request 2',
            description: 'The second support request',
            assignedTo: 'NotMe',
            changeHistory: [{
                changeTime: new Date(),
                changedBy: 'WalkingDisaster',
                changedTo: 'Identified',
                comments: "Don't like it much"
            }]
        }
    ];

    io.of('/support').on('connection', function (socket) {
        socket.on('get', function () {
            for (var i = 0; i < items.length; i++) {
                socket.emit('nextItem', items[i]);
            }
        });

        socket.on('get-one', function (data) {
            var id = data.id;
            var found = items.find((item, index) => {
                return item.id === id;
            })
            socket.emit('get-one-' + id, found);
        });
    });
}