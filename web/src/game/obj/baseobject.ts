import * as BABYLON from 'babylonjs';
import { World } from '../world/world';

export class BaseObject {

    public previousPos: BABYLON.Vector3;
    public sprite: BABYLON.Sprite;

    constructor(protected world: World) {
        this.previousPos = new BABYLON.Vector3(0, 1, 0);
    }

    public update() {
        
    }
}