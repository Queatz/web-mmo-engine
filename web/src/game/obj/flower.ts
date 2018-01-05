import * as BABYLON from 'babylonjs';
import { BaseObject } from './baseobject';
import { World } from '../world/world';

/**
 * Flower object.
 */
export class FlowerObject extends BaseObject {

    constructor(world: World) {
        super(world);
    }

    public render() {
        this.sprite = new BABYLON.Sprite('flowerSprite', this.world.game.spritesItems);
        this.sprite.size = .5;
        this.sprite.position = this.pos;
    }

    public update() {
        super.update();
    }
}