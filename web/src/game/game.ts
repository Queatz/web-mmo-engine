import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import { MapObject } from './obj/map';
import { PlayerObject } from './obj/player';
import { Editor } from './editor/editor';
import { World } from './world/world';

export class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _light: BABYLON.Light;

    private zoom = 4;

    public world: World;
    
    public camera: BABYLON.FreeCamera;
    public scene: BABYLON.Scene;
    public text: GUI.TextBlock;
    public editor: Editor;
    public ui: GUI.AdvancedDynamicTexture;
    public sprites: BABYLON.SpriteManager;
    public sprites2: BABYLON.SpriteManager;

    private pointerDown: boolean;
    private _keysDown: Set<string> = new Set();
    private _keysPressed: Set<string> = new Set();
    private interactionPrevented: boolean;
    
    constructor(canvasElement : HTMLCanvasElement) {
        this._canvas = canvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene() : void {
        this.scene = new BABYLON.Scene(this._engine);
        this.scene.ambientColor = new BABYLON.Color3(1, 1, 1);
 
        this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 10, 0), this.scene);
        this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this.camera.setTarget(BABYLON.Vector3.Zero());

        this.sprites = new BABYLON.SpriteManager('spriteManager', '/assets/slime.png', 1, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        this.sprites2 = new BABYLON.SpriteManager('spriteManager', '/assets/butterfly.png', 1000, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        
        // UI + Text
        
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
        
        this.text = new GUI.TextBlock();
        this.text.isVisible = false;
        this.text.text = 'Hello World';
        this.text.color = 'cyan';
        this.text.fontSize = 48;
        this.text.top = 300;
        this.ui.addControl(this.text);

        this.world = new World(this);

        this.editor = new Editor(this);

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

    public preventInteraction() {
        this.interactionPrevented = true;
    }

    public key(key: string) {
        return this._keysDown.has(key);
    }

    public keyPressed(key: string) {
        return this._keysPressed.has(key);
    }
    
    private update() {
        this.editor.update();
        this.world.update();
        this.camera.position.x = this.world.getPlayer().sprite.position.x;
        this.camera.position.z = this.world.getPlayer().sprite.position.z;
        this._keysPressed.clear();
    }

    private resize(): void {
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
}