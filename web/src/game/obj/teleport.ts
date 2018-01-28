import * as BABYLON from 'babylonjs';
import { BaseObject } from './baseobject';
import { World } from '../world/world';

/**
 * Teleport object.
 */
export class TeleportObject extends BaseObject {

    constructor(world: World) {
        super(world);

        this.editorOnly = true;
    }

    public render() {
        this.sprite = new BABYLON.Sprite('teleportSprite', this.world.game.spritesEditor);
        this.sprite.size = .5;
        this.sprite.position = this.pos;
        this.sprite.cellIndex = 1;
    }

    public update() {
        super.update();
    }
}