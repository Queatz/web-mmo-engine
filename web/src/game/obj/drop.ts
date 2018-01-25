import * as BABYLON from 'babylonjs';
import { BaseObject } from './baseobject';
import { World } from '../world/world';

/**
 * Drop object.
 */
export class DropObject extends BaseObject {

    private itemType: string;
    private quantity: number;

    constructor(world: World) {
        super(world);
    }

    public render() {
        this.sprite = new BABYLON.Sprite('dropSprite', this.world.game.spritesItems);
        this.sprite.cellIndex = this.world.game.inventory.spriteIndex(this.itemType);
        this.sprite.size = .5;
        this.sprite.position = this.pos;
    }

    public update() {
        super.update();
    }

    public data(data: any) {
        this.itemType = data.type;
        this.quantity = data.quantity;
    }
}