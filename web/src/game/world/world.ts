import { MapObject } from "../obj/map";
import { PlayerObject } from "../obj/player";
import { Game } from "../game";
import { WorldService } from "../../app/world.service";
import { StateEvent, ChatEvent, InventoryEvent, MapEvent, ObjEvent } from "../events/events";
import Config from "../config";
import { BaseObject } from "../obj/baseobject";
import { StatBar } from "./statbar";
import { InvItem } from "./inventory";

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

    private _afterUpdate = new Set<any>();

    constructor(public game: Game) {

        this._map = null;
        this._player = null;

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
            this._map.name = event.map.name;

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
                obj.health = o.health;
                obj.magic = o.magic;
                obj.hunger = o.hunger;
                if (o.data) {
                    obj.data(o.data);
                }
                this._map.add(obj);
            });

            this._player = <PlayerObject>this._map.getObjById(event.you);

            this.game.showHeading(this._map.name);
        });
        
        this.game.events.register('chat', (event: ChatEvent) => {
            // to-do
        });
        
        this.game.events.register('inventory', (event: InventoryEvent) => {
            if (event.set) {
                event.set.forEach(inv => this.game.inventory.set(new InvItem(inv.type, inv.qty)));
            }
        });

        this.game.events.register('map', (event: MapEvent) => {
            if (this._map) {
                this._map.mapEvent(event);
            }
        });

        this.game.events.register('obj', (event: ObjEvent) => {
            if (this._map) {
                this._map.objEvent(event);
            }
        });

        this.setMusicEnabled(true);
    }

    /**
     * Enable or disable music.
     */
    public setMusicEnabled(enabled: boolean) {
        if (enabled) {
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
        } else {
            this.setMusic(null);
        }
    }

    /**
     * Sets the game music.
     */
    public setMusic(music: string) {
        if (this._music) {
            this._music.loop = false;
            this._music.stop();
            this._music.dispose();
        }
        
        if (music) {
            this._music = new BABYLON.Sound('music', music, this.game.scene, null, { loop: true, autoplay: true });
        } else {
            this._music = null;
        }
    }

    /**
     * Update world.  Call once per frame.
     */
    public update() {
        this._afterUpdate.forEach(l => l());
        this._afterUpdate.clear();

        let t = new Date().getTime() / 1000;
        this._delta = Math.min(1 / 15, t - this._lastFrameTime);
        this._lastFrameTime = t;

        if (this._map) {
            this._map.update();
        }

        this.game.centerCameraOnPlayer();

        if (this.getPlayer()) {
            this.healthBar.setHealth(this.getPlayer().health);
            this.magicBar.setHealth(this.getPlayer().magic);
            this.hungerBar.setHealth(this.getPlayer().hunger);
            this.healthBar.update();
            this.healthBarBucket.update();
            this.magicBar.update();
            this.magicBarBucket.update();
            this.hungerBar.update();
            this.hungerBarBucket.update();
        }
    }

    /**
     * Run something after the update finishes, including moving the camera.
     */
    public runAfterUpdate(logic: any) {
        this._afterUpdate.add(logic);
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