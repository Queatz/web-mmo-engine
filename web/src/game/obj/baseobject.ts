import * as BABYLON from 'babylonjs';
import { World } from '../world/world';

/**
 * The base type for map objects.  Extend this class.
 */
export class BaseObject {

    public previousPos: BABYLON.Vector3;
    public sprite: BABYLON.Sprite;

    constructor(protected world: World) {
        this.previousPos = new BABYLON.Vector3(0, 1, 0);
    }

    public update() {
        
    }
}