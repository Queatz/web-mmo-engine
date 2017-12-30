import * as BABYLON from 'babylonjs';
import { Game } from '../game';
import { BaseObject } from './baseobject';

export class ButterflyObject extends BaseObject {
    
    constructor(game: Game) {
        super(game);

        this.sprite = new BABYLON.Sprite('butterflySprite', this.game.sprites2);
        this.sprite.size = .5;
        this.sprite.position = new BABYLON.Vector3(0, 1, 0);
        this.sprite.playAnimation(0, 1, true, 100, null);        
    }

    public update() {
        this.sprite.position.x += .2 * (Math.random() - .5)
        this.sprite.position.z += .2 * (Math.random() - .5)
    }
}