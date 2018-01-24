import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { BaseObject } from './baseobject';
import { World } from '../world/world';
import { MoveClientEvent, ActionClientEvent } from '../events/events';

export enum PlayerState {
    ATTACKING,
    INTERACTING
};

/**
 * The main player object.
 */
export class PlayerObject extends BaseObject {

    private speed: number = 2;
    private lastPosSendTime: Date = new Date();
    private lastPosSend: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
    private text: GUI.TextBlock;
    private textOffset = new BABYLON.Vector3(0, 0, -.25);

    private state: Set<PlayerState> = new Set<PlayerState>();
    
    constructor(world: World) {
        super(world);
    }

    public render() {
        this.sprite = new BABYLON.Sprite('playerSprite', this.world.game.spritesPlayer);
        this.sprite.size = .5;
        this.sprite.position = this.pos;

        this.text = new GUI.TextBlock();
        this.text.text = 'slime1';
        this.text.color = 'white';
        this.text.fontFamily = 'Ubuntu, sans';
        this.text.fontStyle = 'bold';
        this.text.fontSize = 22;
        this.text.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.text.shadowOffsetX = 3;
        this.text.shadowOffsetY = 3;
        this.world.game.ui.addControl(this.text);
    }

    public update() {
        super.update();
        
        this.world.runAfterUpdate(() => this.text && this.text.moveToVector3(this.pos.add(this.textOffset), this.world.game.scene));

        if (this.id !== this.world.getPlayer().id) {
            this.updateCharacter();
            return;
        }

        this.collides = true;

        if (this.world.game.key('ArrowDown')) {
            this.pos.z -= this.speed * this.world.delta();
        }

        if (this.world.game.key('ArrowUp')) {
            this.pos.z += this.speed * this.world.delta();
        }

        if (this.world.game.key('ArrowLeft')) {
            this.pos.x -= this.speed * this.world.delta();
        }

        if (this.world.game.key('ArrowRight')) {
            this.pos.x += this.speed * this.world.delta();
        }

        if (this.world.game.key('KeyX')) {
            if (!this.state.has(PlayerState.ATTACKING)) {
                this.state.add(PlayerState.ATTACKING);

                let evt = new ActionClientEvent();
                evt.action = 'attack';
                evt.pos = [this.pos.x, this.pos.z];
                this.world.send(evt);
            }
        } else {
            if (this.state.has(PlayerState.ATTACKING)) {
                this.state.delete(PlayerState.ATTACKING);

                let evt = new ActionClientEvent();
                evt.action = 'attack.stop';
                evt.pos = [this.pos.x, this.pos.z];
                this.world.send(evt);
            }
        }

        if (this.world.game.key('KeyZ')) {
            if (!this.state.has(PlayerState.INTERACTING)) {
                this.state.add(PlayerState.INTERACTING);

                let evt = new ActionClientEvent();
                evt.action = 'interact';
                evt.pos = [this.pos.x, this.pos.z];
                this.world.send(evt);
            }
        } else {
            if (this.state.has(PlayerState.INTERACTING)) {
                this.state.delete(PlayerState.INTERACTING);

                let evt = new ActionClientEvent();
                evt.action = 'interact.stop';
                evt.pos = [this.pos.x, this.pos.z];
                this.world.send(evt);
            }
        }

        this.updateCharacter();

        if (new Date().getTime() - this.lastPosSendTime.getTime() > 250 && !this.pos.equals(this.lastPosSend)) {
            this.lastPosSend.copyFrom(this.pos);
            this.lastPosSendTime.setTime(new Date().getTime());
            let evt = new MoveClientEvent();
            evt.pos = [this.pos.x, this.pos.z];
            this.world.send(evt);
        }
    }

    public updateCharacter() {
        if(this.state.has(PlayerState.ATTACKING)) {
            this.sprite.cellIndex = 1;            
        } else {
            this.sprite.cellIndex = 0;            
        }
    }

    public event(event: any) {
        if (event.state) {
            this.state.clear();
            event.state.forEach(s => {
                switch (s) {
                    case 'attack':
                        this.state.add(PlayerState.ATTACKING);
                        break;
                    case 'interact':
                        this.state.add(PlayerState.INTERACTING);
                        break;
                }
            });
        }
    }

    public dispose() {
        super.dispose();

        if (this.text) {
            this.world.game.ui.removeControl(this.text);
            this.text.dispose();
            this.text = null;
        }
    }
}