import { MapObject } from "../obj/map";
import { PlayerObject } from "../obj/player";
import { Game } from "../game";
import { WorldService } from "../../app/world.service";
import { StateEvent, ChatEvent, InventoryEvent, MapEvent, ObjEvent } from "../events/events";
import Config from "../config";
import { BaseObject } from "../obj/baseobject";
import { StatBar } from "./statbar";

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

    private _music: BABYLON.Sound;

    private healthBar: StatBar;
    private healthBarBucket: StatBar;

    private magicBar: StatBar;
    private magicBarBucket: StatBar;

    private hungerBar: StatBar;
    private hungerBarBucket: StatBar;

    constructor(public game: Game) {

        // XXX TODO remove this - it comes from server now
        this._map = new MapObject(this);
        this._player = new PlayerObject(this);
        this._map.add(this._player);

        this.healthBar = new StatBar(this, '/assets/health_bar.png');
        this.healthBarBucket = new StatBar(this, '/assets/empty_bar.png', true);
        this.magicBar = new StatBar(this, '/assets/magic_bar.png');
        this.magicBarBucket = new StatBar(this, '/assets/empty_bar.png', true);
        this.hungerBar = new StatBar(this, '/assets/hunger_bar.png');
        this.hungerBarBucket = new StatBar(this, '/assets/empty_bar.png', true);

        this.magicBar.setOffset(1);
        this.hungerBar.setOffset(2);
        this.magicBarBucket.setOffset(1);
        this.hungerBarBucket.setOffset(2);

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

        let rndMusic = [
            'Theme1.ogg',
            'Theme2.ogg',
            'Theme3.ogg',
            'Theme4.ogg',
            'Theme5.ogg',
            'Theme6.ogg',
            'Theme7.ogg',
            'Theme12.ogg',
            'Theme13.ogg',
            'Theme15.ogg',
            'Theme16.ogg',
            'Theme17.ogg',
            'Theme21.ogg'
        ];

        this.setMusic('/assets/music/' + rndMusic[Math.floor(Math.random() * rndMusic.length)]);
    }

    /**
     * Sets the game music.
     */
    public setMusic(music: string) {
        if (this._music) {
            this._music.dispose();
        }
        
        this._music = new BABYLON.Sound('music', music, this.game.scene, null, { loop: true, autoplay: true });
    }

    /**
     * Update world.  Call once per frame.
     */
    public update() {
        let t = new Date().getTime() / 1000;
        this._delta = Math.min(1 / 15, t - this._lastFrameTime);
        this._lastFrameTime = t;
        this._map.update();
        this.game.centerCameraOnPlayer();

        this.healthBar.setHealth(this.getPlayer().pos.x / 4);
        this.magicBar.setHealth(this.getPlayer().pos.z / 4);
        this.hungerBar.setHealth(this.getPlayer().pos.x / 4 + this.getPlayer().pos.z / 4);
        this.healthBar.update();
        this.healthBarBucket.update();
        this.magicBar.update();
        this.magicBarBucket.update();
        this.hungerBar.update();
        this.hungerBarBucket.update();
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