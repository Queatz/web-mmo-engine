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
    }

    public render() {
        this.sprite = new BABYLON.Sprite('playerSprite', this.world.game.sprites);
        this.sprite.size = .5;
        this.sprite.position = this.pos;
    }

    public update() {
        super.update();
        if (this.id !== this.world.getPlayer().id) {
            return;
        }

        this.collides = true;

        if (this.world.game.key('ArrowDown')) {
            this.pos.z -= this.speed;
        }

        if (this.world.game.key('ArrowUp')) {
            this.pos.z += this.speed;
        }

        if (this.world.game.key('ArrowLeft')) {
            this.pos.x -= this.speed;
        }

        if (this.world.game.key('ArrowRight')) {
            this.pos.x += this.speed;
        }

        if (new Date().getTime() - this.lastPosSendTime.getTime() > 250 && !this.pos.equals(this.lastPosSend)) {
            this.lastPosSend.copyFrom(this.pos);
            this.lastPosSendTime.setTime(new Date().getTime());
            let evt = new MoveClientEvent();
            evt.pos = [this.pos.x, this.pos.z];
            this.world.send(evt);
        }
    }

    public eventFromClient(event: any) {

    }
}