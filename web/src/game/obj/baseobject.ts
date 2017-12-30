import * as BABYLON from 'babylonjs';
import { Game } from '../game';

export class BaseObject {

    public sprite: BABYLON.Sprite;

    constructor(protected game: Game) {
    }

    public update() {

    }

    public render() {
        
    }
}