import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import { Game } from '../game';
import { MapTile } from '../obj/maptile';

export class Editor {

    private tileSets = [
        '/assets/grassy_tiles.png',
        '/assets/underground_tiles.png'
    ];
    
    private dialog: GUI.Rectangle;
    private toolbar: GUI.Rectangle;
    private selectTileIcon: GUI.Image;
    private selectObjectIcon: GUI.Image;
    private tilesImage: GUI.Image;
    private dialogVisible = false;
    private enabled = true;
    private imageXTileCount = 8;
    private currentTileIndex = 0;
    private currentTileSet = this.tileSets[0];

    constructor(private game: Game) {
        this.toolbar = new GUI.Rectangle();
        this.toolbar.width = '500px';
        this.toolbar.height = '64px';
        this.toolbar.cornerRadius = 5;
        this.toolbar.thickness = 2;
        this.toolbar.background = new BABYLON.Color4(0, 0, 0, .5).toHexString();
        this.toolbar.color = new BABYLON.Color4(1, .5, .25, .5).toHexString();
        this.toolbar.shadowColor = 'black';
        this.toolbar.shadowBlur = 20;

        this.selectTileIcon = new GUI.Image('editorSelectTileIcon', '/assets/grassy_tiles.png');
        this.selectTileIcon.width = '64px';
        this.selectTileIcon.height = '64px';
        this.selectTileIcon.onPointerDownObservable.add(() => {
            this.showDialog();
            this.game.preventInteraction();
        });

        this.toolbar.addControl(this.selectTileIcon);

        this.selectObjectIcon = new GUI.Image('editorSelectTileIcon', '/assets/slime.png');
        this.selectObjectIcon.width = '64px';
        this.selectObjectIcon.height = '64px';
        this.selectObjectIcon.left = '64px';
        this.selectObjectIcon.onPointerDownObservable.add(() => {
            this.showDialog();
            this.game.preventInteraction();
        });

        this.toolbar.addControl(this.selectTileIcon);
        this.toolbar.addControl(this.selectObjectIcon);

        this.setEnabled(true);
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;

        if (enabled) {
            this.game.ui.addControl(this.toolbar);
        } else {
            this.game.ui.removeControl(this.toolbar);
        }
    }

    public update() {
        this.toolbar.top = (this.game.ui.getSize().height / 2) - (this.selectTileIcon.heightInPixels / 2);
        this.toolbar.left = 0;
    }

    public draw(x: number, y: number) {
        this.game.map.draw(x, y, this.currentTileSet, this.currentTileIndex);
    }

    public use(tile: MapTile) {
        if (tile.index < 0) {
            return;
        }

        this.currentTileSet = tile.image;
        this.currentTileIndex = tile.index;
    }

    private showDialog(show: boolean = true) {
        if (show && !this.dialog) {
            this.dialog = new GUI.Rectangle();
            this.dialog.width = '500px';
            this.dialog.height = '550px';
            this.dialog.background = '#aaa';
            this.dialog.shadowColor = 'black';
            this.dialog.shadowBlur = 20;
            this.dialog.thickness = 2;
            this.dialog.cornerRadius = 5;
            this.dialog.background = new BABYLON.Color4(1, .75, .5, 1).toHexString();
            this.dialog.color = new BABYLON.Color4(1, .5, .25, .75).toHexString();

            this.setTileSet(this.currentTileSet);

            let tileSetSwitcher = GUI.Button.CreateSimpleButton('tileSetSwitcher', 'Next Tile Set');
            tileSetSwitcher.top = '250px';
            tileSetSwitcher.background = '#f0f0f0';
            tileSetSwitcher.cornerRadius = 5;
            tileSetSwitcher.height = '30px';
            tileSetSwitcher.width = '200px';
            tileSetSwitcher.color = new BABYLON.Color4(1, .5, .25, .75).toHexString();
            tileSetSwitcher.background = '#fff';
            tileSetSwitcher.thickness = 2;
            tileSetSwitcher.fontFamily = 'sans';
            tileSetSwitcher.onPointerDownObservable.add(() => {
                this.setTileSetIndex(this.tileSets.indexOf(this.currentTileSet) + 1);
                this.game.preventInteraction();
            });

            this.dialog.addControl(tileSetSwitcher);
        }

        if (show && !this.dialogVisible) {
            this.dialogVisible = true;
            this.game.ui.addControl(this.dialog);
        } else {
            this.dialogVisible = false;
            this.game.ui.removeControl(this.dialog);
        }
    }

    private setTileSet(image: string) {
        this.currentTileSet = image;
        
        if (this.tilesImage) {
            this.dialog.removeControl(this.tilesImage);
        }

        this.tilesImage = new GUI.Image('editorSelectTileIcon', this.currentTileSet);
        this.tilesImage.width = '500px';
        this.tilesImage.height = '500px';
        this.tilesImage.top = '-25px';
        this.dialog.addControl(this.tilesImage);
        
        this.tilesImage.onPointerDownObservable.add(evt => {
            this.currentTileIndex = this.getTileIndex(this.tilesImage.getLocalCoordinates(evt));
            this.showDialog(false);
            this.game.preventInteraction();
        });
    }

    private setTileSetIndex(index: number) {
        this.setTileSet(this.tileSets[index % this.tileSets.length]);
    }

    private getTileIndex(pos: BABYLON.Vector2): number {
        let x = Math.floor(pos.x / this.dialog.widthInPixels * this.imageXTileCount);
        let y = Math.floor((this.dialog.heightInPixels - pos.y) / this.dialog.heightInPixels * this.imageXTileCount);

        return y * this.imageXTileCount + x;
    }
}