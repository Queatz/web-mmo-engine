import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import { MapObject } from './obj/map';
import { PlayerObject } from './obj/player';
import { Editor } from './editor/editor';
import { Events } from './events';
import { World } from './world/world';
import { WorldService } from '../app/world.service';
import Config from './config';
import { IdentifyClientEvent } from './events/events';

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
     * Main game singletons.
     */
    public camera: BABYLON.FreeCamera;
    public scene: BABYLON.Scene;
    public text: GUI.TextBlock;

    /**
     * The game editor.
     */
    public editor: Editor;

    /**
     * The main UI layer.
     */
    public ui: GUI.AdvancedDynamicTexture;

    /**
     * Sprite textures.
     */
    public sprites: BABYLON.SpriteManager;
    public spritesNPCs: BABYLON.SpriteManager;
    public spritesItems: BABYLON.SpriteManager;
    public spritesEditor: BABYLON.SpriteManager;

    /**
     * Event handing.
     */
    private pointerDown: boolean;
    private _keysDown: Set<string> = new Set();
    private _keysPressed: Set<string> = new Set();
    private interactionPrevented: boolean;
    
    constructor(canvasElement : HTMLCanvasElement, private worldService: WorldService) {
        Config.init();
        
        this._canvas = canvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
        this.events = new Events();

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
 
        this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 10, 0), this.scene);
        this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this.camera.setTarget(BABYLON.Vector3.Zero());

        this.sprites = new BABYLON.SpriteManager('spriteManager', '/assets/slime.png', 1000, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        this.spritesNPCs = new BABYLON.SpriteManager('spriteManager', '/assets/butterfly.png', 1000, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        this.spritesItems = new BABYLON.SpriteManager('spriteManager', '/assets/items.png', 1000, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        this.spritesEditor = new BABYLON.SpriteManager('spriteManager', '/assets/flower_spawn_area.png', 1000, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        
        // UI + Text
        
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this.scene);
        
        this.text = new GUI.TextBlock();
        this.text.isVisible = false;
        this.text.text = 'Hello World';
        this.text.color = 'cyan';
        this.text.fontSize = 48;
        this.text.top = 300;
        this.ui.addControl(this.text);

        this.editor = new Editor(this);
        this.world = new World(this);

        this.scene.onPointerMove = evt => {
            if (this.interactionPrevented) {
                return;
            }

            if (!this.pointerDown) {
                return;
            }

            this.editor.draw(evt.clientX, evt.clientY);
        };

        this.scene.onPointerDown = evt => {
            if (this.interactionPrevented) {
                return;
            }

            this.pointerDown = true;
            
            if (this._keysDown.has('ControlLeft') || this._keysDown.has('ControlRight')) {
                this.editor.use(this.world.getMap().pickTile(evt.clientX, evt.clientY));
            } else {
                this.editor.draw(evt.clientX, evt.clientY);
            }
        }

        this.scene.onPointerUp = () => {
            this.pointerDown = false;
        }

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
    
    /**
     * Called on init.
     */
    public doRender() : void {
        this.resize();

        // run the render loop
        this._engine.runRenderLoop(() => {
            this.interactionPrevented = false;
            this.update();
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
    
    /**
     * Update the game.  Called once per frame.
     */
    private update() {
        // Update world
        this.editor.update();
        this.world.update();

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

        // Update camera position
        if (this.world.getPlayer()) {
            this.camera.position.x = this.world.getPlayer().pos.x;
            this.camera.position.z = this.world.getPlayer().pos.z;
        }
        
        // Post frame handling
        this._keysPressed.clear();
    }

    /**
     * Called when the game viewport is externally resized.
     */
    private resize(): void {
        this.ui.getContext().imageSmoothingEnabled = false;

        let aspect = this._engine.getAspectRatio(this.camera, true);

        if (aspect > 1) {
            this.camera.orthoTop = this.zoom / aspect;
            this.camera.orthoBottom = -this.zoom / aspect;
            this.camera.orthoLeft = -this.zoom;
            this.camera.orthoRight = this.zoom;
        } else {
            this.camera.orthoTop = this.zoom;
            this.camera.orthoBottom = -this.zoom;
            this.camera.orthoLeft = -this.zoom * aspect;
            this.camera.orthoRight = this.zoom * aspect;
        }
    }
}