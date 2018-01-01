import {
    IdentifyClientEvent,
    RegisterClientEvent,
    EditorClientEvent,
    ChatClientEvent,
    MoveClientEvent,
    ActionClientEvent,
    InventoryClientEvent,
    EditClientEvent
} from "./events/events";

export class Events {

    private _handlers: Map<string, (event: any) => void> = new Map();
    public typeFromClass = new Map<any, string>();
    
    constructor() {
        [
            ['identify', IdentifyClientEvent],
            ['register', RegisterClientEvent],
            ['editor', EditorClientEvent],
            ['chat', ChatClientEvent],
            ['move', MoveClientEvent],
            ['action', ActionClientEvent],
            ['inventory', InventoryClientEvent],
            ['edit', EditClientEvent]
        ].forEach((t: any[]) => {
            this.typeFromClass.set(t[1], t[0]);
        });
    }

    public register(action: string, handler: (event: any) => void) {
        if (this._handlers.has(action)) {
            console.log('Cannot re-register event handler for action: ' + action);
            return;
        }

        this._handlers.set(action, handler);
    }

    public unregister(action: string, handler: (event: any) => void) {
        if (!this._handlers.has(action) || this._handlers.get(action) !== handler) {
            console.log('Cannot un-register event handler for action: ' + action);
            return;
        }

        this._handlers.delete(action);
    }

    public handleServerEvent(action: string, data: any) {
        if (!this._handlers.has(action)) {
            console.log('Unhandlable event: ' + action, data);
            return;
        }

        this._handlers.get(action)(data);
    }

}