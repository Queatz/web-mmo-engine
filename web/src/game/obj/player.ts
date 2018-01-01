import * as BABYLON from 'babylonjs';
import { BaseObject } from './baseobject';
import { World } from '../world/world';
import { MoveClientEvent } from '../events/events';

/**
 * The main player object.
 */
export class PlayerObject extends BaseObject {

    private speed: number = 0.05;
    private lastPosSendTime: Date = new Date();
    private lastPosSend: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
    
    constructor(world: World) {
        super(world);

        this.sprite = new BABYLON.Sprite('playerSprite', this.world.game.sprites);
        this.sprite.size = .5;
        this.sprite.position = new BABYLON.Vector3(0, 1, 0);
    }

    public update() {
        if (this.id !== this.world.getPlayer().id) {
            return;
        }

        if (this.world.game.key('ArrowDown')) {
            this.sprite.position.z -= this.speed;
        }

        if (this.world.game.key('ArrowUp')) {
            this.sprite.position.z += this.speed;
        }

        if (this.world.game.key('ArrowLeft')) {
            this.sprite.position.x -= this.speed;
        }

        if (this.world.game.key('ArrowRight')) {
            this.sprite.position.x += this.speed;
        }

        if (new Date().getTime() - this.lastPosSendTime.getTime() > 500 && !this.sprite.position.equals(this.lastPosSend)) {
            this.lastPosSend.copyFrom(this.sprite.position);
            this.lastPosSendTime.setTime(new Date().getTime());
            let evt = new MoveClientEvent();
            evt.pos = [this.sprite.position.x, this.sprite.position.z];
            this.world.send(evt);
        }
    }

    public eventFromClient(event: any) {

    }
}