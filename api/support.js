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

        socket.on('viewing', function (data) {
            var id = data.id;
            var userName = data.userName;
            socket.broadcast.emit('view-start', {
                id: id,
                userName: userName
            })
        });
        socket.on('stopped viewing', function (data) {
            var id = data.id;
            var userName = data.userName;
            socket.broadcast.emit('view-end', {
                id: id,
                userName: userName
            })
        });

        socket.on('find', function (data, fn) {
            var id = data.id;
            var found = items.find((item, index) => {
                return item.id === id;
            })
            fn(found);
        });

        socket.on('editing', function (data) {
            var id = data.id;
            var userName = data.userName;
            var fieldName = data.fieldName;
            socket.broadcast.emit(`editing-${id}-${fieldName}`, {
                userName: userName
            })
        });

        socket.on('release', function (data) {
            var id = data.id;
            var userName = data.userName;
            var fieldName = data.fieldName;
            var newValue = data.value;

            var entity = items.find((item) => {
                return item.id === id;
            });
            if (!entity) {
                return;
            }
            entity[fieldName] = newValue;
            socket.broadcast.emit(`released-${id}-${fieldName}`, {
                userName: userName,
                value: newValue
            })
        })

        socket.on('new', function (data, fn) {
            var userName = data.userName;

            var newItem = {
                id: ++lastId,
                recorded: new Date(),
                recordedBy: userName,
                title: null,
                description: null,
                assignedTo: null,
                changeHistory: [{
                    changeTime: new Date(),
                    changedBy: userName,
                    changedTo: 'Identified',
                    comments: 'Created'
                }]
            };
            items.push(newItem);
            socket.broadcast.emit('nextItem', newItem);
            fn(newItem);
        })
    });
}