import * as BABYLON from 'babylonjs';
import { BaseObject } from './baseobject';
import { World } from '../world/world';

/**
 * Fox object.
 */
export class FoxObject extends BaseObject {
    private velocity: BABYLON.Vector3;
    private currentAnimationIndex = 0;
    
    constructor(world: World) {
        super(world);
    }

    public render() {
        this.velocity = new BABYLON.Vector3(0, 0, 0);
        
        this.sprite = new BABYLON.Sprite('foxSprite', this.world.game.spritesFox);
        this.sprite.size = .5;
        this.sprite.position = this.pos;

        this.targetMoveSpeed.x = 3;
        this.targetMoveSpeed.z = 3;
    }

    public update() {
        super.update();

        if (this.targetPos) {
            let i;
            let h = this.targetPos.x - this.pos.x;
            let v = this.targetPos.z - this.pos.z;

            if (Math.abs(h) < Math.abs(v)) {
                i = v < 0 ? 1 : 0;
            } else {
                i = h < 0 ? 2 : 3;
            }

            if (i !== this.currentAnimationIndex) {
                this.currentAnimationIndex = i;
                this.sprite.playAnimation(i * 2, i * 2 + 1, true, 250, null);
            }
        }
    }
}