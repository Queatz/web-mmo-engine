import * as BABYLON from 'babylonjs';
import { BaseObject } from './baseobject';
import { World } from '../world/world';

/**
 * The main player object.
 */
export class PlayerObject extends BaseObject {

    private speed: number = 0.05;
    
    constructor(world: World) {
        super(world);

        this.sprite = new BABYLON.Sprite('playerSprite', this.world.game.sprites);
        this.sprite.size = .5;
        this.sprite.position = new BABYLON.Vector3(0, 1, 0);
    }

    public update() {
        if (this.world.game.key('ArrowDown')) {
            this.sprite.position.z -= this.speed;
        }

        if (this.world.game.key('ArrowUp')) {
            this.sprite.position.z += this.speed;
        }

        if (this.world.game.key('ArrowLeft')) {
            this.sprite.position.x -= this.speed;
        }

        if (this.world.game.key('ArrowRight')) {
            this.sprite.position.x += this.speed;
        }
    }

    public eventFromClient(event: any) {

    }
}