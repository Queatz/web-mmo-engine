
# Events Overview

## Client -> Server Events

### Account Events 

[
    'identify',
    {
        token: '<user_token>', // optional
        username: '', // [ optional, 
        password: '' // optional ]
    }
]

[
    'register',
    {
        token: '',
        username: '',
        password: ''
    }
]

### Game Events

[
    'editor',
    {
        enabled: true | false
    }
]

### World Events

[
    'chat',
    {
        room: 'global' | 'local',
        msg: ''
    }
]

### Player Events

[
    'move',
    [x, y]
]

[
    'action',
    ['interact|attack', x, y]
]

[
    'inventory',
    {
        drop: ['item', x, y],
        use: ['item']
    }
]

### Editor Events

[
    'edit',
    {
        tile: [x, y, '<tile_set>', <tile_index>],
        addObj: ['type', x, y, {<object_data>}],
        removeObj: 'id',
        moveObj: ['id', x, y]
    }
]

## Server -> Client Events

### World Events

[
    'state',
    {
        map: {
            name: '',
            tiles: [[x, y, 'set', index], ...],
            objs: [{ type, x, y, data }, {}]
        },
        you: 'id'
    }
]

* Note: 'you' will always be in the map objs list.

[
    'chat',
    {
        from: {
            id, name
        },
        room: 'global' | 'local',
        msg: ''
    }
]

### Map Events

[
    'map',
    {
        remove: [id, id, ...],
        add: [obj, obj, ...],
        weather: 'rain' | 'dust' | '',
        tiles: [
            ['set', x, y],
            ...
        ]
    }
]

### Player Events

[
    'inventory',
    {
        add: {<inventory_item>},
        remove: {<inventory_item>}
    }
]

### Object Events

[
    'obj',
    {
        move: [x, y],
        custom: { ... }
    }
]