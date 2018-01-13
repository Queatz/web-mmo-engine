import * as BABYLON from 'babylonjs';
import { BaseObject } from './baseobject';
import { World } from '../world/world';

/**
 * Drop object.
 */
export class DropObject extends BaseObject {

    constructor(world: World) {
        super(world);
    }

    public render() {
        this.sprite = new BABYLON.Sprite('dropSprite', this.world.game.spritesItems);
        this.sprite.cellIndex = 1;
        this.sprite.size = .5;
        this.sprite.position = this.pos;
    }

    public update() {
        super.update();
    }
}