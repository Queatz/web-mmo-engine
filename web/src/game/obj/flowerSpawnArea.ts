import * as BABYLON from 'babylonjs';
import { BaseObject } from './baseobject';
import { World } from '../world/world';

/**
 * Flower Spawn Area object.
 */
export class FlowerSpawnAreaObject extends BaseObject {

    constructor(world: World) {
        super(world);

        this.editorOnly = true;
    }

    public render() {
        this.sprite = new BABYLON.Sprite('flowerSpawnAreaSprite', this.world.game.spritesEditor);
        this.sprite.size = .5;
        this.sprite.position = this.pos;
    }

    public update() {
        super.update();
    }
}