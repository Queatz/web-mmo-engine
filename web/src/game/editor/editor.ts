import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import { Game } from '../game';
import { MapTile } from '../obj/maptile';
import { ButterflyObject } from '../obj/butterfly';
import { BunnyObject } from '../obj/bunny';
import { BaseObject } from '../obj/baseobject';
import { PlayerObject } from '../obj/player';
import { TeleportObject } from '../obj/teleport';
import { FlowerSpawnAreaObject } from '../obj/flowerSpawnArea';
import Config from '../config';
import { MapEvent, ObjDef, EditClientEvent } from '../events/events';
import { GameDialog } from '../ui/dialog';

/**
 * Game Editor
 * 
 * Handles all level building activities.
 */
export class Editor {
    
    private dialog: GameDialog;
    private toolbar: GUI.Rectangle;
    private selectTileIcon: GUI.Image;
    private selectObjectIcon: GUI.Image;
    private selectEditObjectIcon: GUI.Image;
    private selectMoveObjectIcon: GUI.Image;
    private selectDelObjectIcon: GUI.Image;
    private editorSelection: GUI.Image;
    private tilesImage: GUI.Image;
    private enabled = false;
    private imageXTileCount = 8;
    private currentTileIndex = 0;
    private currentTileSet = Config.tileSets[0];
    private editorPenMode = 'tile';
    private currentObjMove: BaseObject;
    private currentObjClass: any;

    public onEditorEnabledObservable: BABYLON.Observable<boolean> = new BABYLON.Observable<boolean>();

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

        let x = -128;

        this.selectTileIcon = new GUI.Image('editorSelectTileIcon', '/assets/grassy_tiles.png');
        this.selectTileIcon.width = '64px';
        this.selectTileIcon.height = '64px';
        this.selectTileIcon.left = x + 'px';
        this.selectTileIcon.onPointerDownObservable.add(() => {
            this.showDialog();
            this.setDialogContent('tile');            
            this.game.preventInteraction();
        });

        x += 64;

        this.selectObjectIcon = new GUI.Image('editorSelectObjectIcon', '/assets/slime.png');
        this.selectObjectIcon.width = '64px';
        this.selectObjectIcon.height = '64px';
        this.selectObjectIcon.left = x + 'px';
        this.selectObjectIcon.onPointerDownObservable.add(() => {
            this.showDialog();
            this.setDialogContent('obj');
            this.game.preventInteraction();
        });

        x += 64;        

        this.selectEditObjectIcon = new GUI.Image('editorSelectEditObjectIcon', '/assets/edit_obj.png');
        this.selectEditObjectIcon.width = '64px';
        this.selectEditObjectIcon.height = '64px';
        this.selectEditObjectIcon.left = x + 'px';
        this.selectEditObjectIcon.onPointerDownObservable.add(() => {
            this.editorPenMode = 'edit';
            this.editorSelection.left = this.selectEditObjectIcon.leftInPixels;            
            this.game.preventInteraction();
        });

        x += 64;        

        this.selectMoveObjectIcon = new GUI.Image('editorSelectMoveObjectIcon', '/assets/move_obj.png');
        this.selectMoveObjectIcon.width = '64px';
        this.selectMoveObjectIcon.height = '64px';
        this.selectMoveObjectIcon.left = x + 'px';
        this.selectMoveObjectIcon.onPointerDownObservable.add(() => {
            this.editorPenMode = 'move';
            this.editorSelection.left = this.selectMoveObjectIcon.left;
            this.game.preventInteraction();
        });

        x += 64;        

        this.selectDelObjectIcon = new GUI.Image('editorSelectDelObjectIcon', '/assets/del_obj.png');
        this.selectDelObjectIcon.width = '64px';
        this.selectDelObjectIcon.height = '64px';
        this.selectDelObjectIcon.left = x + 'px';
        this.selectDelObjectIcon.onPointerDownObservable.add(() => {
            this.editorPenMode = 'del';
            this.editorSelection.left = this.selectDelObjectIcon.left;
            this.game.preventInteraction();
        });

        x += 64;
        
        this.toolbar.addControl(this.selectTileIcon);
        this.toolbar.addControl(this.selectObjectIcon);
        this.toolbar.addControl(this.selectEditObjectIcon);
        this.toolbar.addControl(this.selectMoveObjectIcon);
        this.toolbar.addControl(this.selectDelObjectIcon);

        this.editorSelection = new GUI.Image('editorSelectDelObjectIcon', '/assets/editor_selection.png');
        this.editorSelection.width = '64px';
        this.editorSelection.height = '64px';
        this.editorSelection.left = this.selectTileIcon.left;
        this.editorSelection.isHitTestVisible = false;

        this.toolbar.addControl(this.editorSelection);
    }

    /**
     * Enable the game editor.
     */
    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
        this.onEditorEnabledObservable.notifyObservers(this.enabled);

        if (enabled) {
            this.game.ui.addControl(this.toolbar);
        } else {
            this.game.ui.removeControl(this.toolbar);

            if (this.dialog && this.dialog.isAttached()) {
                this.dialog.show(false);
            }
        }
    }

    /**
     * Determine if the editor is currently enabled.
     */
    public isEnabled() {
        return this.enabled;
    }

    /**
     * Run the editor updates. Call once per frame.
     */
    public update() {
        if (this.game.keyPressed('KeyE')) {
            this.setEnabled(!this.enabled);
        }

        if (!this.enabled) {
            return;
        }

        this.toolbar.top = (this.game.ui.getSize().height / 2) - (this.selectTileIcon.heightInPixels / 2);
        this.toolbar.left = 0;
    }

    /**
     * Handles mouse down events.
     */
    public draw(x: number, y: number): boolean {
        if (!this.enabled) {
            return false;
        }

        switch (this.editorPenMode) {
            case 'tile':
                let tile = this.game.world.getMap().getTileAt(this.game.world.getMap().tileXY(x, y));

                if (tile && tile.image === this.currentTileSet && tile.index === this.currentTileIndex) {
                    break;
                }

                this.game.world.getMap().draw(x, y, this.currentTileSet, this.currentTileIndex);

                let editEvent = new EditClientEvent();
                let xy = this.game.world.getMap().tileXY(x, y);
                editEvent.tile = [xy.x, xy.y, Config.tileSets.indexOf(this.currentTileSet), this.currentTileIndex];
                this.game.send(editEvent);

                break;
            case 'obj':
                let pos = this.game.world.getMap().getXY(x, y);

                let evt = new EditClientEvent();
                let objDef = new ObjDef();
                objDef.pos = [pos.x, pos.y];
                objDef.type = Config.objTypesInverse.get(this.currentObjClass);
                evt.addObj = objDef;
                this.game.send(evt);
                
                break;
            case 'move':
                let movePos = this.game.world.getMap().getXY(x, y);

                this.currentObjMove = this.game.world.getMap().getFirstObjAtPos(movePos);

                if (this.currentObjMove){
                    this.currentObjMove.pos.x = movePos.x;
                    this.currentObjMove.pos.z = movePos.y;

                    let evt = new EditClientEvent();
                    let objDef = new ObjDef();
                    objDef.id = this.currentObjMove.id;
                    objDef.pos = [movePos.x, movePos.y];
                    evt.moveObj = objDef;
                    this.game.send(evt);
                }
                
                break;
            case 'del':
                let delPos = this.game.world.getMap().getXY(x, y);

                let obj = this.game.world.getMap().getFirstObjAtPos(delPos);

                if (obj) {
                    let evt = new EditClientEvent();
                    evt.removeObj = obj.id;
                    this.game.send(evt);
                }

                break;
    
        }

        return true;
    }

    /**
     * Set the tile to use from an external source.
     */
    public use(tile: MapTile) {
        if (!this.enabled) {
            return;
        }

        if (tile.index < 0) {
            return;
        }

        this.editorPenMode = 'tile';
        this.currentTileSet = tile.image;
        this.currentTileIndex = tile.index;
        this.editorSelection.left = this.selectTileIcon.left;
    }

    /**
     * Shows the editor dialog. Also call setDialogContent() after this.
     */
    private showDialog(show: boolean = true) {
        if (!this.dialog) {
            this.dialog = new GameDialog(this.game);
        }

        this.dialog.show(show);
    }

    /**
     * Set the contents of the editor dialog.
     * 
     * Possible values:
     *      'tile'
     *      'obj'
     */
    private setDialogContent(content: string) {
        if (!this.dialog) {
            return;
        }

        this.dialog.getDialogElement().children.length = 0;

        switch (content) {
            case 'tile':
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
                    this.setTileSetIndex(Config.tileSets.indexOf(this.currentTileSet) + 1);
                    this.game.preventInteraction();
                });
        
                this.dialog.getDialogElement().addControl(tileSetSwitcher);

                break;
            case 'obj':

                let imgAndTypes: any[] = [
                    ['/assets/Bunny-front-final.png', BunnyObject],
                    ['/assets/butterfly_idle.png', ButterflyObject],
                    ['/assets/slime.png', PlayerObject],
                    ['/assets/editor_objs.png', FlowerSpawnAreaObject, 0],
                    ['/assets/editor_objs.png', TeleportObject, 1]
                ];

                for (let i = 0; i < imgAndTypes.length; i++) {
                    let obj = new GUI.Image('objIcon', imgAndTypes[i][0]);
                    obj.width = '64px';
                    obj.height = '64px';
                    obj.top = (-250 + 64 * (i + 1)) + 'px';

                    if (imgAndTypes[i].length > 2) {
                        obj.cellWidth = 16;
                        obj.cellHeight = 16;
                        obj.cellId = imgAndTypes[i][2];
                    }

                    obj.onPointerDownObservable.add(() => {
                        this.editorPenMode = 'obj';
                        this.editorSelection.left = this.selectObjectIcon.left;
                        this.currentObjClass = imgAndTypes[i][1];
                        this.showDialog(false);
                        this.game.preventInteraction();
                    });

                    this.dialog.getDialogElement().addControl(obj);
                }

                break;
        }
    }

    /**
     * Set the tile set by image name.
     */
    private setTileSet(image: string) {
        this.currentTileSet = image;
        
        if (this.tilesImage) {
            this.dialog.getDialogElement().removeControl(this.tilesImage);
        }

        this.tilesImage = new GUI.Image('editorSelectTileIcon', this.currentTileSet);
        this.tilesImage.width = '500px';
        this.tilesImage.height = '500px';
        this.tilesImage.top = '-25px';
        this.dialog.getDialogElement().addControl(this.tilesImage);
        
        this.tilesImage.onPointerDownObservable.add(evt => {
            this.currentTileIndex = this.getTileIndex(this.tilesImage.getLocalCoordinates(evt));
            this.editorPenMode = 'tile';
            this.editorSelection.left = this.selectTileIcon.left;
            this.showDialog(false);
            this.game.preventInteraction();
        });
    }

    /**
     * Set the tile set by index. See Config.tileSets.
     */
    private setTileSetIndex(index: number) {
        this.setTileSet(Config.tileSets[index % Config.tileSets.length]);
    }

    /**
     * Get the tile at under a map position.
     */
    private getTileIndex(pos: BABYLON.Vector2): number {
        let x = Math.floor(pos.x / this.tilesImage.widthInPixels * this.imageXTileCount);
        let y = Math.floor((this.tilesImage.heightInPixels - pos.y) / this.tilesImage.heightInPixels * this.imageXTileCount);

        return y * this.imageXTileCount + x;
    }
}