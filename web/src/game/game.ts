import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import { MapObject } from './obj/map';
import { PlayerObject } from './obj/player';
import { Editor } from './editor/editor';

export class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _light: BABYLON.Light;

    private zoom = 4;

    // Should be World.getCurrentMap();
    public map: MapObject;
    public player: PlayerObject;
    
    public camera: BABYLON.FreeCamera;
    public scene: BABYLON.Scene;
    public text: GUI.TextBlock;
    public editor: Editor;
    public ui: GUI.AdvancedDynamicTexture;
    public sprites: BABYLON.SpriteManager;

    private pointerDown: boolean;
    private _keysDown: Set<string> = new Set();
    private interactionPrevented: boolean;
    
    constructor(canvasElement : HTMLCanvasElement) {
        this._canvas = canvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene() : void {
        // create a basic BJS Scene object
        this.scene = new BABYLON.Scene(this._engine);
        this.scene.ambientColor = new BABYLON.Color3(1, 1, 1);
 
        this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 10, 0), this.scene);
        this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this.camera.setTarget(BABYLON.Vector3.Zero());

        this.sprites = new BABYLON.SpriteManager('spriteManager', '/assets/slime.png', 10, 16, this.scene, 0, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        
        this.map = new MapObject(this);
        this.player = new PlayerObject(this);
        this.map.add(this.player);
        
        // UI + Text
        
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
        
        this.text = new GUI.TextBlock();
        this.text.text = 'Hello World';
        this.text.color = 'cyan';
        this.text.fontSize = 48;
        this.text.top = 300;
        this.ui.addControl(this.text);

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
                this.editor.use(this.map.pickTile(evt.clientX, evt.clientY));
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
                    break;
                case BABYLON.KeyboardEventTypes.KEYUP:
                    this._keysDown.delete(evt.event.code);
                    break;
            }
        });
    }

    update() {
        this.camera.position.x = this.player.sprite.position.x;
        this.camera.position.z = this.player.sprite.position.z;

        this.editor.update();
        this.map.update();
    }

    public preventInteraction() {
        this.interactionPrevented = true;
    }

    key(key: string) {
        switch (key) {
            case 'ArrowDown':
                this.player.sprite.position.z -= .125;
                break;
            case 'ArrowUp':
                this.player.sprite.position.z += .125;
                break;
            case 'ArrowLeft':
                this.player.sprite.position.x -= .125;
                break;
            case 'ArrowRight':
                this.player.sprite.position.x += .125;
                break;
        }
    }

    resize(): void {
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

    doRender() : void {
        this.resize();

        // run the render loop
        this._engine.runRenderLoop(() => {
            this.interactionPrevented = false;
            this._keysDown.forEach(key => this.key(key));
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