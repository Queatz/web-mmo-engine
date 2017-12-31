import * as BABYLON from 'babylonjs';
import { Game } from '../game';

export class BaseObject {

    public previousPos: BABYLON.Vector3;
    public sprite: BABYLON.Sprite;

    constructor(protected game: Game) {
        this.previousPos = new BABYLON.Vector3(0, 1, 0);
    }

    public update() {
        
    }
}