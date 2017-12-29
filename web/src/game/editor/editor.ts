import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import { Game } from '../game';

export class Editor {
    
    private dialog: GUI.Rectangle;
    private selectTileIcon: GUI.Image;
    private enabled = true;
    private imageXTileCount = 8;
    private currentTileIndex = 0;

    constructor(private game: Game) {
        this.selectTileIcon = new GUI.Image('editorSelectTileIcon', '/assets/grassy_tiles.png');
        this.selectTileIcon.width = '64px';
        this.selectTileIcon.height = '64px';
        this.selectTileIcon.shadowColor = 'black';
        this.selectTileIcon.shadowBlur = 20;
        this.selectTileIcon.onPointerDownObservable.add(() => {
            this.showDialog();
            this.game.preventInteraction();
        });

        this.game.ui.addControl(this.selectTileIcon);
    }

    public update() {
        this.selectTileIcon.top = (this.game.ui.getSize().height / 2) - (this.selectTileIcon.heightInPixels / 2);
        this.selectTileIcon.left = 0;
    }

    public draw(x: number, y: number) {
        this.game.map.draw(x, y, this.currentTileIndex);
    }

    public use(index: number) {
        if (index < 0) {
            return;
        }

        this.currentTileIndex = index;
    }

    private showDialog(show: boolean = true) {
        if (show && !this.dialog) {
            this.dialog = new GUI.Rectangle();
            this.dialog.width = '512px';
            this.dialog.height = '512px';
            this.dialog.background = '#aaa';
            this.dialog.shadowColor = 'black';
            this.dialog.shadowBlur = 20;
            this.dialog.cornerRadius = 5;

            let tiles = new GUI.Image('editorSelectTileIcon', '/assets/grassy_tiles.png');
            tiles.width = this.dialog.width;
            tiles.height = this.dialog.height;
            this.dialog.addControl(tiles);

            tiles.onPointerDownObservable.add(evt => {
                this.currentTileIndex = this.getTileIndex(tiles.getLocalCoordinates(evt));
                this.showDialog(false);
                this.game.preventInteraction();
            });
        }

        if (show) {
            this.game.ui.addControl(this.dialog);
        } else {
            this.game.ui.removeControl(this.dialog);
        }
    }

    private getTileIndex(pos: BABYLON.Vector2): number {
        let x = Math.floor(pos.x / this.dialog.widthInPixels * this.imageXTileCount);
        let y = Math.floor((this.dialog.heightInPixels - pos.y) / this.dialog.heightInPixels * this.imageXTileCount);

        return y * this.imageXTileCount + x;
    }
}