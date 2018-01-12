import * as BABYLON from 'babylonjs';
import { BaseObject } from './baseobject';
import { World } from '../world/world';

/**
 * Butterfly object.
 */
export class ButterflyObject extends BaseObject {
    private velocity: BABYLON.Vector3;
    
    constructor(world: World) {
        super(world);
    }

    public render() {
        this.velocity = new BABYLON.Vector3(0, 0, 0);
        
        this.sprite = new BABYLON.Sprite('butterflySprite', this.world.game.spritesNPCs);
        this.sprite.size = .5;
        this.sprite.position = this.pos;
        this.sprite.playAnimation(0, 1, true, 250, null);

        this.targetMoveSpeed.x = 3;
        this.targetMoveSpeed.z = 3;
    }

    public update() {
        super.update();
    }
}