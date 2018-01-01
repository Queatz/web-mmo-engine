
# Communication Layer

This section describes how events move across the game.

## Client -> Server

### Send

 1. let evt = new ObjectMove(x, y);
 2. this.world.send(evt);
 3. this.game.sendAll([evt.json()]);

### Receive

get [['evt', data]]

## Server -> Client

### Send

let event = new ObjectMove(obj.getId(), obj.x, obj.y)
map.playersNear(obj).send(event);
client.send();

### Receive

JsonElement event = got [['', {}]]

Event events.get(event.get(0));
handlers.get(event.type()).handle(event);

# Initial Connect Flow


<ws connect>

{
    me: '<tok>'
}

{
    you: 'id',
    world: {
        map: {
            name,
            tiles: {
                '0:5': []
            }
            objects
        }
    }
}

<server sub to map>


# Game

List of events

[{
    obj: 'objId',
    evt: { <event> }
}, ...]

# World

Individual event

{
    obj: 'objId',
    evt: { <event> }
}

# Object

Individual event data

{ <event> }