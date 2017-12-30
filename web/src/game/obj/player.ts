import * as BABYLON from 'babylonjs';
import { Game } from '../game';
import { BaseObject } from './baseobject';

export class PlayerObject extends BaseObject {
    
    constructor(game: Game) {
        super(game);

        this.sprite = new BABYLON.Sprite('playerSprite', this.game.sprites);
        this.sprite.size = .5;
        this.sprite.position = new BABYLON.Vector3(0, 1, 0);
    }

    public update() {
        
    }
}