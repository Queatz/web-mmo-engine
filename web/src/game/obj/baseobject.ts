import * as BABYLON from 'babylonjs';
import { World } from '../world/world';

/**
 * The base type for map objects.  Extend this class.
 */
export class BaseObject {

    public id: string;
    public previousPos: BABYLON.Vector3;
    public sprite: BABYLON.Sprite;

    constructor(protected world: World) {
        this.previousPos = new BABYLON.Vector3(0, 1, 0);
    }

    /**
     * Override to provide object update behavior.
     */
    public update() {
        
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