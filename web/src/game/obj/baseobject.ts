import * as BABYLON from 'babylonjs';
import { World } from '../world/world';

/**
 * The base type for map objects.  Extend this class.
 */
export class BaseObject {

    public id: string;
    public pos: BABYLON.Vector3;
    public previousPos: BABYLON.Vector3;
    public targetPos: BABYLON.Vector3;
    public targetMoveSpeed: BABYLON.Vector3 = new BABYLON.Vector3(2, 0, 2);
    public sprite: BABYLON.Sprite;
    public collides = false;
    public editorOnly = false;

    public health: number;
    public magic: number;
    public hunger: number;

    constructor(protected world: World) {
        this.previousPos = new BABYLON.Vector3(0, 1, 0);
        this.pos = new BABYLON.Vector3(0, 1, 0);
    }

    /**
     * Show the object. Should set the sprite.
     */
    public render() {
        
    }

    /**
     * Hide the object.
     */
    public hide() {
        if (this.sprite) {
            this.sprite.dispose();
            this.sprite = null;
        }
    }

    /**
     * Override to provide object update behavior.
     */
    public update() {
        if (!this.sprite) {
            return;
        }

        this.sprite.invertV = -1;
        this.sprite.invertU = -1;

        if (this.targetPos) {
            let diff = this.targetPos.subtract(this.pos);

            let pop = (this.targetMoveSpeed.x + this.targetMoveSpeed.y) * this.world.delta();
            
            if (diff.length() < pop) {
                this.pos.copyFrom(this.targetPos);
                this.targetPos = null;
            } else {
                let s = (diff.length() > 1 ? 2 : 1) * this.world.delta();
                let vec = diff.normalize().multiply(this.targetMoveSpeed.multiplyByFloats(s, s, s));
                this.pos.addInPlace(vec);
            }
        }
    }

    /**
     * Move the object smoothly to a location.
     */
    public moveTo(x: number, y: number) {
        this.targetPos = new BABYLON.Vector3(x, 1, y);
    }

    /**
     * Override to provide custom event handling.
     */
    public event(event: any) {

    }

    /**
     * Load object state from data.
     */
    public data(data: any) {
        
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