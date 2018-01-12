export class ObjDef {
    id: string;
    type: string;
    pos: number[];
    health: number;
    magic: number;
    hunger: number;
    data: any;
}

export class MapDef {
    name: string;
    tiles: number[][];
    objs: ObjDef[];
}

export class ChatFromDef {
    id: string;
    name: string;
}

export class InventoryItemDef {
    type: string;
    qty: number;
    pos: number[];
}

// Client -> Server
 
export class IdentifyClientEvent {
    token: string;
    username: string;
    password: string;
}

export class RegisterClientEvent {
    token: string;
    username: string;
    password: string;
}

export class EditorClientEvent {
    enabled: boolean;
}

export class ChatClientEvent {
    room: string;
    msg: string;
}

export class MoveClientEvent {
    pos: number[];
}

export class ActionClientEvent {
    action: string;
    pos: number[];
}

export class InventoryClientEvent {
    drop: InventoryItemDef;
    use: InventoryItemDef;
}

export class EditClientEvent {
    tile: number[];
    addObj: ObjDef;
    removeObj: string;
    moveObj: ObjDef;
}


// Server -> Client

export class StateEvent {
    map: MapDef;
    you: string;
}

export class ChatEvent {
    from: ChatFromDef;
    room: string;
    msg: string;
}

export class InventoryEvent {
    add: InventoryItemDef[];
    remove: InventoryItemDef[];
}

export class MapEvent {
    remove: string[];
    add: ObjDef[];
    weather: string;
    tiles: number[][];
}

export class ObjEvent {
    id: string;
    pos: number[];
    health: number;
    magic: number;
    hunger: number;
    custom: any;
}