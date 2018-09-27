import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { World } from '../world/world';
import { Game } from '../game';

/**
 * A basic dialog with    isAttached(): any {
        throw new Error("Method not implemented.");
    }
 a single action button.
 */
export class GameDialog {

    private dialogElement: GUI.Rectangle;
    private actionButton: GUI.Button;

    constructor(private game: Game) {
    }

    show(show: boolean) {
        if (show && !this.getDialogElement().parent) {
            this.game.ui.addControl(this.dialogElement);
        } else {
            this.game.ui.removeControl(this.dialogElement);
        }
    }

    isAttached() {
        return !!this.getDialogElement().parent;
    }

    getDialogElement(): GUI.Rectangle {
        if (!this.dialogElement) {
            this.dialogElement = new GUI.Rectangle();

            let cell = 64 + this.getPadding();
            let dlgWidth = cell * 8;
            let dlgHeight = cell * 8 + 42/*button height + padding*/;

            this.dialogElement.width = (dlgWidth + this.getPadding() * 2) + 'px';
            this.dialogElement.height = (dlgHeight + this.getPadding() * 2) + 'px';
            this.dialogElement.shadowColor = 'black';
            this.dialogElement.shadowBlur = 20;
            this.dialogElement.thickness = 2;
            this.dialogElement.cornerRadius = 5;
            this.dialogElement.background = new BABYLON.Color4(1, .75, .5, .75).toHexString();
            this.dialogElement.color = new BABYLON.Color4(1, .5, .25, .75).toHexString();

            this.actionButton = GUI.Button.CreateSimpleButton('actionButton', 'Close');
            this.actionButton.top = (dlgHeight / 2 - 20) + 'px';
            this.actionButton.background = '#f0f0f0';
            this.actionButton.cornerRadius = 5;
            this.actionButton.height = '30px';
            this.actionButton.width = '200px';
            this.actionButton.color = new BABYLON.Color4(1, .5, .25, .75).toHexString();
            this.actionButton.background = '#fff';
            this.actionButton.thickness = 2;
            this.actionButton.fontFamily = 'sans';
            this.actionButton.onPointerUpObservable.add(() => {
                this.game.preventInteraction();
                this.show(false);
            });
            this.dialogElement.addControl(this.actionButton);
        }

        return this.dialogElement;
    }

    getPadding() {
        return 4;
    }
}