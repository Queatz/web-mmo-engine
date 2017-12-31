import { MapObject } from "../obj/map";
import { PlayerObject } from "../obj/player";
import { Game } from "../game";

export class World {

    private _map: MapObject;
    private _player: PlayerObject;

    constructor(public game: Game) {
        this._map = new MapObject(this);
        this._player = new PlayerObject(this);
        this._map.add(this._player);
    }

    public update() {
        this._map.update();
    }
    
    public getMap(): MapObject {
        return this._map;
    }
    
    public getPlayer(): PlayerObject {
        return this._player;
    }
}