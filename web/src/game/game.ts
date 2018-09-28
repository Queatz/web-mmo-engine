import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import { Editor } from './editor/editor';
import { Events } from './events';
import { World } from './world/world';
import { WorldService } from '../app/world.service';
import Config from './config';
import { IdentifyClientEvent } from './events/events';
import { Inventory } from './world/inventory';
import { GameDialog } from './ui/dialog';

/**
 * The base game.
 * 
 * Class structure is like:
 * Game -> World -> Map -> Object
 */
export class Game {

    /**
     * Internal types
     */
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;

    /**
     * The default global game zoom level.
     */
    private zoom = 4;

    /**
     * The default camera distance.
     */
    private cameraDistance = 5;

    /**
     * The game world.
     */
    public world: World;

    /**
     * Events to be sent this frame. Can be multiple.
     */
    private _eventsQueue = [];

    /**
     * Event handing.
     */
    public events: Events;
    
    /**
     * Inventory handing.
     */
    public inventory: Inventory;
    private inventoryDialog: GameDialog;
    private inventoryUIElements: Map<string, GUI.Control> = new Map<string, GUI.Image>();
    
    /**
     * Options
     */
    private optionsDialog: GameDialog;

    /**
     * Main game singletons.
     */
    public camera: BABYLON.FreeCamera;
    public scene: BABYLON.Scene;
    public text: GUI.TextBlock;
    public textTimer: number;

    /**
     * The game editor.
     */
    public editor: Editor;

    /**
     * The main UI layer.
     */
    public ui: GUI.AdvancedDynamicTexture;
    public inventoryButton: GUI.Image;    
    public musicOnButton: GUI.Image;    
    public musicOffButton: GUI.Image;    
    public optionsButton: GUI.Image;    

    /**
     * Sprite textures.
     */
    public sprites: BABYLON.SpriteManager;
    public spritesPlayer: BABYLON.SpriteManager;
    public spritesNPCs: BABYLON.SpriteManager;
    public spritesCreatures: BABYLON.SpriteManager;
    public spritesFox: BABYLON.SpriteManager;
    public spritesItems: BABYLON.SpriteManager;
    public spritesEditor: BABYLON.SpriteManager;

    /**
     * Resources
     */
    public chompSound: BABYLON.Sound;

    /**
     * Event handing.
     */
    private pointerDown: boolean;
    private pointerDownPos: BABYLON.Vector2 = new BABYLON.Vector2();
    private pointerPos: BABYLON.Vector2 = new BABYLON.Vector2();
    private _keysDown: Set<string> = new Set();
    private _keysPressed: Set<string> = new Set();
    private interactionPrevented: boolean;
    
    constructor(canvasElement: HTMLCanvasElement, private worldService: WorldService) {
        Config.init();
        
        this._canvas = canvasElement;
        this._engine = new BABYLON.Engine(this._canvas, false);
        this.events = new Events();
        this.inventory = new Inventory();

        this.identify();
    }

    public identify() {
        let token: string = localStorage.getItem('token');

        if (!token) {
            token = this.rndStr();
            localStorage.setItem('token', token);
        }
        
        let evt = new IdentifyClientEvent();
        evt.token = token;
        this.send(evt);
    }

    private rndStr() {
        return Math.random().toString(36).substring(7) +
            Math.random().toString(36).substring(7) + 
            Math.random().toString(36).substring(7);
    }

    /**
     * Called on init.
     */
    createScene() : void {
        this.scene = new BABYLON.Scene(this._engine);
        this.scene.ambientColor = new BABYLON.Color3(1, 1, 1);
 
        this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, this.cameraDistance, -this.cameraDistance), this.scene);
        this.camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
        this.camera.fov = Math.PI / this.zoom;
        this.camera.setTarget(BABYLON.Vector3.Zero());

        this.sprites = new BABYLON.SpriteManager('spriteManager1', '/assets/slime.png', 999, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        this.spritesPlayer = new BABYLON.SpriteManager('spriteManager2', '/assets/slime_eat.png', 999, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        this.spritesNPCs = new BABYLON.SpriteManager('spriteManager3', '/assets/butterfly.png', 999, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        this.spritesCreatures = new BABYLON.SpriteManager('spriteManager4', '/assets/bunny.png', 999, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        this.spritesFox = new BABYLON.SpriteManager('spriteManager4', '/assets/foxy.png', 999, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        this.spritesItems = new BABYLON.SpriteManager('spriteManager5', '/assets/items.png', 999, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        this.spritesEditor = new BABYLON.SpriteManager('spriteManager6', '/assets/editor_objs.png', 999, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        
        this.chompSound = new BABYLON.Sound('chomp', '/assets/chomp.ogg', this.scene);

        // UI + Text
        
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this.scene);

        this.text = new GUI.TextBlock();
        this.text.isVisible = false;
        this.text.isHitTestVisible = false;
        this.text.text = 'Hello World';
        this.text.color = 'white';
        this.text.fontFamily = 'Ubuntu, sans';
        this.text.fontSize = 48;
        this.text.top = 300;
        this.text.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.text.shadowBlur = 1;
        this.text.shadowOffsetX = 3;
        this.text.shadowOffsetY = 3;
        this.ui.addControl(this.text);

        this.editor = new Editor(this);
        this.world = new World(this);

        this.scene.onPointerObservable.add(info => {
            switch (info.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if (this.interactionPrevented) {
                        return;
                    }
        
                    this.pointerDown = true;
                    this.pointerDownPos.set(info.event.clientX, info.event.clientY);
                    this.pointerPos.copyFrom(this.pointerDownPos);
                    
                    if (this._keysDown.has('ControlLeft') || this._keysDown.has('ControlRight')) {
                        this.editor.use(this.world.getMap().pickTile(info.event.clientX, info.event.clientY));
                    } else {
                        this.editor.draw(info.event.clientX, info.event.clientY);
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    this.pointerDown = false;
                    break;
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    if (this.interactionPrevented) {
                        return;
                    }
        
                    this.pointerPos.set(info.event.clientX, info.event.clientY);
                    if (!this.pointerDown) {
                        return;
                    }
        
                    this.editor.draw(info.event.clientX, info.event.clientY);
                    break;
            }
        });

        this.scene.onKeyboardObservable.add(evt => {
            switch (evt.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    this._keysDown.add(evt.event.code);
                    this._keysPressed.add(evt.event.code);
                    break;
                case BABYLON.KeyboardEventTypes.KEYUP:
                    this._keysDown.delete(evt.event.code);
                    break;
            }
        });
    }

    public showHeading(str: string) {
        this.text.text = str || '';
        this.text.alpha = 1;
        this.text.isVisible = true;
        this.textTimer = 4;
    }
    
    /**
     * Called on init.
     */
    public doRender(): void {
        this.resize();

        // run the render loop
        this._engine.runRenderLoop(() => {
            this.interactionPrevented = false;
            this.update();

            if (this.textTimer > 0) {
                this.textTimer -= this.world.delta();
                
                if (this.textTimer <= 0) {
                    this.textTimer = 0;
                    this.text.isVisible = false;
                    this.setUpActionBar();
                } else {
                    this.text.alpha = Math.min(1, this.textTimer);
                }
            }

            this.scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
            this.resize();
        });
    }

    /**
     * Handle game event.
     */
    public event(action: string, data: any) {
        
    }

    /**
     * Send an event to the server.
     * 
     * @param event The event to send
     */
    public send(event: any) {
        this._eventsQueue.push([this.events.typeFromClass.get(event.constructor), event]);
    }

    /**
     * Get events from the server.
     * 
     * @param events The events from the server
     */
    public handleEvents(events: any[]) {
        events.forEach((event: any[]) => {
            this.events.handleServerEvent(event[0], event[1]);
        });
    }

    /**
     * Prevent the game from handing mouse input this frame.
     */
    public preventInteraction() {
        this.interactionPrevented = true;
    }

    /**
     * Check if a key is currently held down.
     */
    public key(key: string) {
        return this._keysDown.has(key);
    }

    /**
     * Check if a key was pressed this frame.
     */
    public keyPressed(key: string) {
        return this._keysPressed.has(key);
    }

    public getDragDelta() {
        if (!this.pointerDown) {
            return new BABYLON.Vector2(0, 0);
        }

        return this.pointerPos.subtract(this.pointerDownPos);
    }

    /**
     * Move camera to player.
     */
    public centerCameraOnPlayer() {
        if (this.world.getPlayer()) {
            this.camera.position.x = this.world.getPlayer().pos.x;
            this.camera.position.z = this.world.getPlayer().pos.z - this.cameraDistance;
        }
    }
    
    /**
     * Update the game.  Called once per frame.
     */
    private update() {
        // Update world
        this.editor.update();
        this.world.update();

        if (this.keyPressed('KeyI')) {
            this.showInv(!this.inventoryDialog || !this.inventoryDialog.isAttached());
        }

        // Send any events to server
        if (this._eventsQueue.length > 0) {
            let success = this.worldService.send(this._eventsQueue);

            if (!success) {
                if (this.worldService.server.closed()) {
                    this.worldService.server.reconnect();
                    this.identify();
                }
            }

            this._eventsQueue = [];
        }

        // Post frame handling
        this._keysPressed.clear();
    }

    /**
     * Show inventory dialog.
     */
    private showInv(show: boolean = true) {
        if (!this.inventoryDialog) {
            this.inventoryDialog = new GameDialog(this);

            let cell = 64 + this.inventoryDialog.getPadding();
            let dlgWidth = cell * 8;
            let dlgHeight = cell * 8 + 42/*button height + padding*/;

            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    let gridCell = new GUI.Image('invGrid' + x + 'x' + y, '/assets/ui/inventory_grid_bkg.png');
                    gridCell.width = '64px';
                    gridCell.height = '64px';
                    gridCell.left = (-dlgWidth / 2 + cell / 2 + cell * x) + 'px';
                    gridCell.top = (-dlgHeight / 2 + cell / 2 + cell * y) + 'px';

                    this.inventoryDialog.getDialogElement().addControl(gridCell);
                }
            }

            this.inventory.onInventoryUpdatedObservable.add(() => {
                if (this.inventoryDialog.isAttached()) {
                    this.refreshInventoryItemsOnGrid();
                }
            });
        }

        this.scaleDialogToFit(this.inventoryDialog);

        this.inventoryDialog.show(show);

        if (show) {
            this.inventory.select(null);
            this.refreshInventoryItemsOnGrid();
        }
    }

    /**
     * Display inventory items and quantities on the grid.
     */
    private refreshInventoryItemsOnGrid() {
        this.inventoryUIElements.forEach(e => this.inventoryDialog.getDialogElement().removeControl(e));
        this.inventoryUIElements.clear();

        let cell = 64 + this.inventoryDialog.getPadding();
        let dlgWidth = cell * 8;
        let dlgHeight = cell * 8 + 42/*button height + padding*/;

        let x = 0, y = 0;

        this.inventory.all().forEach(inv => {
            let img = new GUI.Image('invItemType', '/assets/items.png');
            let qty = new GUI.TextBlock('invItemQty', inv.qty.toString());
            let uiElement = new GUI.Rectangle();
            uiElement.thickness = 0;
            uiElement.width = '64px';
            uiElement.height = '64px';
            img.cellHeight = 16;
            img.cellWidth = 16;
            img.cellId = this.inventory.spriteIndex(inv.type);
            img.width = '64px';
            img.height = '64px';
            qty.color = 'white';
            qty.fontFamily = 'Ubuntu, sans';
            qty.fontStyle = 'bold';
            qty.fontSize = 16;
            qty.shadowColor = 'rgba(0, 0, 0, 0.75)';
            qty.shadowBlur = 1;
            qty.shadowOffsetX = 1;
            qty.shadowOffsetY = 1;
            qty.resizeToFit = true;
            qty.textHorizontalAlignment = GUI.TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
            qty.textVerticalAlignment = GUI.TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
            qty.onAfterDrawObservable.add(t => {
                t.top = (t.parent.heightInPixels / 2 - t.heightInPixels / 2 - 4) + 'px';
                t.left = (t.parent.widthInPixels / 2 - t.widthInPixels / 2 - 4) + 'px';
            });
            uiElement.addControl(img);
            uiElement.addControl(qty);
            uiElement.left = (-dlgWidth / 2 + cell / 2 + cell * x) + 'px';
            uiElement.top = (-dlgHeight / 2 + cell / 2 + cell * y) + 'px';
            uiElement.onPointerDownObservable.add(() => {
                this.showInv(false);
                this.inventory.select(inv);
            });
            this.inventoryUIElements.set(inv.type, uiElement);
            this.inventoryDialog.getDialogElement().addControl(uiElement);

            if (x < 8) {
                x += 1;
            } else {
                y += 1;
                x = 0;
            }
        });
    }

    private showOptions(show: boolean) {
        if (!this.optionsDialog) {
            this.optionsDialog = new GameDialog(this);

            let info = new GUI.TextBlock();
            info.color = 'black';
            info.fontFamily = 'Ubuntu, sans';
            info.isHitTestVisible = false;
            info.text = 'Controls\n========\n\nArrows to move\nZ to Interact\nX to Attack\nC to Use Current Item\nV to Drop Current Item\n\nOpen Inventory to select Current Item';
            this.optionsDialog.getDialogElement().addControl(info);
        }

        this.scaleDialogToFit(this.optionsDialog);

        this.optionsDialog.show(show);
    }

    private scaleDialogToFit(dialog: GameDialog) {
        let scale: number;

        if (dialog.getDialogElement().widthInPixels > this.ui.getSize().width ||
            dialog.getDialogElement().heightInPixels > this.ui.getSize().height) {
            scale = Math.min(
                this.ui.getSize().width / dialog.getDialogElement().widthInPixels,
                this.ui.getSize().height / dialog.getDialogElement().heightInPixels
            );
        } else {
            scale = 1;
        }

        dialog.getDialogElement().scaleX = scale;
        dialog.getDialogElement().scaleY = scale;
    }

    /**
     * Setup and / or resize game UI.
     */
    private setUpActionBar() {
        if(!this.inventoryButton) {
            this.inventoryButton = new GUI.Image('inventoryButton', '/assets/ui/inv_icon.png');
            this.inventoryButton.width = '64px';
            this.inventoryButton.height = '64px';
            this.inventoryButton.onPointerDownObservable.add(evt => {
                this.preventInteraction();
                this.showInv(!this.inventoryDialog || !this.inventoryDialog.isAttached());
            });
            this.ui.addControl(this.inventoryButton);
        }

        if (!this.musicOnButton) {
            this.musicOnButton = new GUI.Image('musicOnButton', '/assets/ui/music_on.png');
            this.musicOnButton.width = '64px';
            this.musicOnButton.height = '64px';
            this.musicOnButton.onPointerDownObservable.add(evt => {
                this.preventInteraction();
                this.world.setMusicEnabled(false);
                this.musicOnButton.isVisible = false;
                this.musicOffButton.isVisible = true;
                this.musicOnButton.isHitTestVisible = false;
                this.musicOffButton.isHitTestVisible = true;
            });
            this.ui.addControl(this.musicOnButton);
        }

        if (!this.musicOffButton) {
            this.musicOffButton = new GUI.Image('musicOffButton', '/assets/ui/music_off.png');
            this.musicOffButton.isVisible = false;
            this.musicOffButton.width = '64px';
            this.musicOffButton.height = '64px';
            this.musicOffButton.onPointerDownObservable.add(evt => {
                this.preventInteraction();
                this.world.setMusicEnabled(true);
                this.musicOnButton.isVisible = true;
                this.musicOffButton.isVisible = false;
                this.musicOnButton.isHitTestVisible = true;
                this.musicOffButton.isHitTestVisible = false;
            });
            this.ui.addControl(this.musicOffButton);
        }

        if (!this.optionsButton) {
            this.optionsButton = new GUI.Image('optionsButton', '/assets/ui/options.png');
            this.optionsButton.width = '64px';
            this.optionsButton.height = '64px';
            this.optionsButton.onPointerDownObservable.add(evt => {
                this.preventInteraction();
                this.showOptions(true);
            });
            this.ui.addControl(this.optionsButton);
        }

        let toolsLeft = (this.ui.getSize().width / 2 - this.inventoryButton.widthInPixels / 1.5);
        let toolsTop = (this.ui.getSize().height / 2 - this.inventoryButton.heightInPixels / 1.5);

        this.inventoryButton.left = toolsLeft + 'px';
        this.inventoryButton.top = toolsTop + 'px';

        let h = this.inventoryButton.heightInPixels;

        this.musicOnButton.left = toolsLeft + 'px';
        this.musicOnButton.top = (toolsTop - h - 4) + 'px';
        this.musicOffButton.left = toolsLeft + 'px';
        this.musicOffButton.top = (toolsTop - h - 4) + 'px';
        this.musicOnButton.top = (toolsTop - h - 4) + 'px';
        this.optionsButton.left = toolsLeft + 'px';
        this.optionsButton.top = (toolsTop - h * 2 - 4) + 'px';

        if (!this.optionsDialog) {
            this.showOptions(true);
        }
    }

    /**
     * Called when the game viewport is externally resized.
     */
    private resize(): void {
        setTimeout(() => this.setUpActionBar(), 2000); // XXX TODO Figure out why this is needed to allow clicks
        this.ui.getContext().imageSmoothingEnabled = false;

        let aspect = this._engine.getAspectRatio(this.camera, true);

        if (aspect > 1) {
            this.camera.fovMode = BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED;
            this.camera.orthoTop = -this.zoom / aspect;
            this.camera.orthoBottom = this.zoom / aspect;
            this.camera.orthoLeft = this.zoom;
            this.camera.orthoRight = -this.zoom;
        } else {
            this.camera.fovMode = BABYLON.Camera.FOVMODE_VERTICAL_FIXED;
            this.camera.orthoTop = -this.zoom;
            this.camera.orthoBottom = this.zoom;
            this.camera.orthoLeft = this.zoom * aspect;
            this.camera.orthoRight = -this.zoom * aspect;
        }
    }
}