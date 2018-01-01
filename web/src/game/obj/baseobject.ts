import * as BABYLON from 'babylonjs';
import { World } from '../world/world';

/**
 * The base type for map objects.  Extend this class.
 */
export class BaseObject {

    public id: string;
    public previousPos: BABYLON.Vector3;
    public targetPos: BABYLON.Vector3;
    public targetMoveSpeed: BABYLON.Vector3 = new BABYLON.Vector3(0.05, 0, 0.05);
    public sprite: BABYLON.Sprite;
    public collides = false;

    constructor(protected world: World) {
        this.previousPos = new BABYLON.Vector3(0, 1, 0);
    }

    /**
     * Override to provide object update behavior.
     */
    public update() {
        if (this.targetPos) {
            let diff = this.targetPos.subtract(this.sprite.position);
            
            if (diff.length() < this.targetMoveSpeed.x + this.targetMoveSpeed.y) {
                this.sprite.position.copyFrom(this.targetPos);
                this.targetPos = null;
            } else {
                let s = diff.length() > 2 ? 4 : 1;
                let vec = diff.normalize().multiply(this.targetMoveSpeed.multiplyByFloats(s, s, s));
                this.sprite.position.addInPlace(vec);
            }
        }
    }

    public moveTo(x: number, y: number) {
        this.targetPos = new BABYLON.Vector3(x, 1, y);
    }

    /**
     * Override to provide custom event handling.
     */
    public event(event: any) {

    }

    /**
     * Remove the object.
     */
    public dispose() {
        if (this.sprite) {
            this.sprite.dispose();
        }
    }
}