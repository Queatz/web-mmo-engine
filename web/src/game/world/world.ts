import { MapObject } from "../obj/map";
import { PlayerObject } from "../obj/player";
import { Game } from "../game";
import { WorldService } from "../../app/world.service";
import { StateEvent, ChatEvent, InventoryEvent, MapEvent, ObjEvent } from "../events/events";
import Config from "../config";
import { BaseObject } from "../obj/baseobject";

/**
 * The world object.
 * 
 * Holds references to the current player and map.
 * 
 * Proxies server messages to the right objects.
 * 
 * Sends messages from the player to the server.
 */
export class World {

    private _map: MapObject;
    private _player: PlayerObject;
    
    private _delta: number;
    private _lastFrameTime: number;

    constructor(public game: Game) {

        // XXX TODO remove this - it comes from server now
        this._map = new MapObject(this);
        this._player = new PlayerObject(this);
        this._map.add(this._player);

        this.game.events.register('state', (event: StateEvent) => {
            if (this._map) {
                this._map.dispose();
            }
            
            if (this._player) {
                this._player.dispose();
            }

            this._map = new MapObject(this);

            event.map.tiles.forEach(t => {
                this._map.setTile(t[0], t[1], t[2], t[3]);
            });

            event.map.objs.forEach(o => {
                if (!Config.objTypes.has(o.type)) {
                    console.log('Unknown object type: ' + o.type);
                    return;
                }

                let type = Config.objTypes.get(o.type);
                let obj: BaseObject = new type(this);
                obj.id = o.id;
                obj.pos.x = o.pos[0];
                obj.pos.z = o.pos[1];
                this._map.add(obj);
            });

            this._player = <PlayerObject>this._map.getObjById(event.you);
        });
        
        this.game.events.register('chat', (event: ChatEvent) => {
            // to-do
        });
        
        this.game.events.register('inventory', (event: InventoryEvent) => {
            // to-do
        });

        this.game.events.register('map', (event: MapEvent) => {
            this._map.mapEvent(event);
        });

        this.game.events.register('obj', (event: ObjEvent) => {
            this._map.objEvent(event);
        });
    }

    /**
     * Update world.  Call once per frame.
     */
    public update() {
        let t = new Date().getTime() / 1000;
        this._delta = t - this._lastFrameTime;
        this._lastFrameTime = t;
        this._map.update();
    }

    /**
     * Get current delta since last update in sections.
     */
    public delta(): number {
        return this._delta;
    }
    
    /**
     * Get the current map.
     */
    public getMap(): MapObject {
        return this._map;
    }
    
    /**
     * Get the current player object.
     */
    public getPlayer(): PlayerObject {
        return this._player;
    }

    /**
     * Send an event to the server from the player.
     */
    public send(evt: any) {
        this.game.send(evt);
    }
}