
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