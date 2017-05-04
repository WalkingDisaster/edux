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
            }],
            viewers: new Set(),
            locked: false,
            lockedBy: null
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
            }],
            viewers: new Set(),
            locked: false,
            lockedBy: null
        }
    ];

    io.of('/support').on('connection', function (socket) {
        var getDto = function (item) {
            return {
                item: item,
                viewers: Array.from(item.viewers),
                locked: item.locked,
                lockedBy: item.lockedBy
            };
        };
        socket.on('disconnect', function (socket) {});

        socket.on('get', function () {
            for (var i = 0; i < items.length; i++) {
                var dto = getDto(items[i]);
                socket.emit('nextItem', dto);
            }
        });

        socket.on('viewing', function (data) {
            var id = data.id;
            var userName = data.userName;
            var found = items.find(item => item.id === id);
            if (!found.viewers.has(userName)) {
                found.viewers.add(userName)
            }
            socket.nsp.emit('view-start', {
                id: id,
                userName: userName
            })
        });
        socket.on('stopped viewing', function (data) {
            var id = data.id;
            var userName = data.userName;
            var filtered = items.filter(item => id === null || item.id === id);

            for (var i = 0; i < filtered.length; i++) {
                var item = filtered[i];
                if (item.viewers.has(userName)) {
                    item.viewers.delete(userName)
                    socket.nsp.emit('view-end', {
                        id: item.id,
                        userName: userName
                    });
                }
            }
        });

        socket.on('find', function (data, fn) {
            var id = data.id;
            var found = items.find((item, index) => {
                return item.id === id;
            })
            var dto = getDto(found);
            fn(dto);
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
                }],
                viewers: new Set(),
                locked: false,
                lockedBy: null
            };
            items.push(newItem);
            var dto = getDto(newItem);
            socket.broadcast.emit('nextItem', dto);
            fn(dto);
        })
    });
}