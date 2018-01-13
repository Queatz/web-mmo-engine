import * as BABYLON from 'babylonjs';
import Config from '../config';
import { MapTile } from './maptile';
import { BaseObject } from './baseobject';
import { World } from '../world/world';
import { MapEvent, ObjEvent } from '../events/events';

/**
 * Map object.
 */
export class MapObject {

    /**
     * The map name
     */
    public name: string;

    /**
     * The size of a single tile
     */
    private tileSize = .5;

    /**
     * The number of tiles in a map segment.
     */
    private mapSize = 10;

    /**
     * The maximum size of a total map.
     */
    private maxMapSize = 100;

    /**
     * The number of tiles in a tile set image horizontally.
     */
    private imageXTileCount = 8;

    /**
     * The default tile when none were specified for a tile position.
     */
    private defaultTile = new MapTile('/assets/grassy_tiles.png', 20);

    /**
     * Which tiles are non-colliding.  Tiles collide by default.
     * 
     * Initialized in constructor.
     */
    private tileSetsNoCollision: Map<string, Set<number>> = new Map();
    
    /**
     * Internal stuff.
     */
    private ground: BABYLON.Mesh;
    private meshes: Map<string, BABYLON.Mesh> = new Map();
    private multimat: BABYLON.MultiMaterial;
    private tiles: Map<string, MapTile> = new Map();
    private materialIndexes = [];

    /**
     * The objects on this map.
     */
    private objs = new Set<BaseObject>();
    private objsById = new Map<string, BaseObject>();

    constructor(private world: World) {

        this.tileSetsNoCollision.set(Config.tileSets[0], new Set<number>([
            20, 24, 25, 26, 27, 33, 35, 36, 40, 41, 42, 43, 44, 46, 48, 49, 50, 51, 56, 57, 58, 59
        ]));

        this.tileSetsNoCollision.set(Config.tileSets[1], new Set<number>([
            
        ]));

        this.ground = BABYLON.MeshBuilder.CreateGround('ground', {width: this.maxMapSize, height: this.maxMapSize, subdivisions: 1}, this.world.game.scene);
        this.ground.isPickable = true;
        this.ground.isVisible = false;

        // Map multimat
        this.multimat = new BABYLON.MultiMaterial('multi', this.world.game.scene);

        // Map texture
        this.addMaterial('/assets/grassy_tiles.png');

        this.world.game.editor.onEditorEnabledObservable.add(enabled => {
            this.objs.forEach(obj => {
                if (obj.editorOnly) {
                    if (enabled) {
                        obj.render();
                    } else {
                        obj.hide();
                    }
                }
            });
        });
    }

    /**
     * Handle event for map.
     */
    public mapEvent(event: MapEvent) {
        if (event.add) {
            event.add.forEach(o => {
                if (!Config.objTypes.has(o.type)) {
                    console.log('Unknown object type: ' + o.type);
                    return;
                }

                let type = Config.objTypes.get(o.type);
                let obj: BaseObject = new type(this.world);
                obj.id = o.id;
                obj.pos.x = o.pos[0];
                obj.pos.z = o.pos[1];
                obj.health = o.health;
                obj.magic = o.magic;
                obj.hunger = o.hunger;
                this.add(obj);
            });
        }

        if (event.remove) {
            event.remove.forEach(o => this.remove(o));
        }

        if (event.tiles) {
            event.tiles.forEach(t => {
                this.setTile(t[0], t[1], t[2], t[3]);
            });
        }

        if (event.weather) {
            alert('The weather is ' + event.weather);
        }
    }

    /**
     * Handle event for object.
     */
    public objEvent(event: ObjEvent) {
        let obj = this.objsById.get(event.id);

        if (!obj) {
            console.log('Object not found on map: ' + event.id);
            return;
        }

        if (event.pos) {
            (obj as BaseObject).moveTo(event.pos[0], event.pos[1]);
        }

        if (event.health) {
            obj.health = event.health;
        }

        if (event.magic) {
            obj.magic = event.magic;
        }

        if (event.hunger) {
            obj.hunger = event.hunger;
        }

        if (event.custom) {
            obj.event(event.custom);
        }
    }

    /**
     * Add an object to the map.
     */
    public add(obj: BaseObject) {
        this.objs.add(obj);
        this.objsById.set(obj.id, obj);

        if (!obj.editorOnly || this.world.game.editor.isEnabled()) {
            obj.render();
        }
    }

    /**
     * Remove an object to the map.
     */
    public remove(id: string) {
        if (this.objsById.has(id)) {
            let obj = this.objsById.get(id);
            this.objs.delete(obj);
            this.objsById.delete(id);
            obj.dispose();
        }
    }

    /**
     * Get an object by id.
     */
    public getObjById(id: string) {
        return this.objsById.get(id);
    }

    /**
     * Update the map.
     */
    public update() {
        this.objs.forEach(obj => {
            obj.previousPos.copyFrom(obj.pos);
            obj.update();

            if (obj.collides && obj.sprite) {
                this.collide(obj);
            }
        });
    }
    
    /**
     * Remove the map.
     */
    public dispose() {
        this.ground.dispose();

        this.meshes.forEach(mesh => mesh.dispose());

        this.objs.forEach(obj => obj.dispose());

        this.multimat.dispose();
    }

    /**
     * Set a tile.
     */
    public setTile(x: number, y: number, set: number, idx: number) {
        this.tiles.set(this.tileKey(x, y), new MapTile(Config.tileSets[set], idx)); 
        this.updateTileSet(x, y, Config.tileSets[set]);
        this.updateTileUVs(x, y, idx);
    }

    /**
     * Collide an object with map tiles.
     */
    public collide(obj: BaseObject) {
        let tile = this.getTileAt(this.posToTile(new BABYLON.Vector2(
            obj.pos.x,
            obj.pos.z
        )));
        
        if (!this.isCollideTile(tile)) {
            return;
        }

        // Check x
        
        tile = this.getTileAt(this.posToTile(new BABYLON.Vector2(
            obj.pos.x,
            obj.previousPos.z
        )));

        if (!this.isCollideTile(tile)) {
            obj.pos.z = obj.previousPos.z;
            return;
        }

        // Check y
        
        tile = this.getTileAt(this.posToTile(new BABYLON.Vector2(
            obj.previousPos.x,
            obj.pos.z
        )));

        if (!this.isCollideTile(tile)) {
            obj.pos.x = obj.previousPos.x;
            return;
        }

        obj.pos.copyFrom(obj.previousPos);
    }

    /**
     * Check if a tile collides.
     */
    public isCollideTile(tile: MapTile): boolean {
        return this.tileSetsNoCollision.has(tile.image) && !this.tileSetsNoCollision.get(tile.image).has(tile.index);
    }

    /**
     * Draw a tile, using mouse pointer position.
     * 
     * For editing.
     */
    public draw(pointerX: number, pointerY: number, tileSet: string, index: number) {
        let pick = this.tileXY(pointerX, pointerY);

        this.world.game.text.text = pick.x + ', ' + pick.y;

        this.tiles.set(this.tileKey(pick.x, pick.y), new MapTile(tileSet, index));        
        this.updateTileSet(pick.x, pick.y, tileSet);
        this.updateTileUVs(pick.x, pick.y, index);
    }

    /**
     * Get the tile under the mouse pointer.
     */
    public pickTile(pointerX: number, pointerY: number): MapTile {
        let pick = this.tileXY(pointerX, pointerY);

        return this.getTileAt(pick);
    }

    /**
     * Get the first object at a map position.
     */
    public getFirstObjAtPos(pos: BABYLON.Vector2) {
        var i = this.objs.values();

        for(let r = i.next(); !r.done; r = i.next()) {
            if (r.value.sprite) {
                if (Math.abs(r.value.pos.x - pos.x) < r.value.sprite.size / 2 &&
                    Math.abs(r.value.pos.z - pos.y) < r.value.sprite.size / 2) {
                        return r.value;
                }
            }
        }

        return null;
    }

    /**
     * Get a tile at map tile position.
     */
    public getTileAt(pos: BABYLON.Vector2): MapTile {
        let vec = this.tileKey(pos.x, pos.y);
        
        if (this.tiles.has(vec)) {
            return this.tiles.get(vec);
        }

        return this.defaultTile;
    }

    /**
     * Get the map position at the mouse pointer.
     */
    public getXY(pointerX: number, pointerY: number): BABYLON.Vector2 {
        let pick = this.pickXY(pointerX, pointerY);
        
        if (!pick || !pick.pickedPoint) {
            return BABYLON.Vector2.Zero();
        }

        return new BABYLON.Vector2(
            pick.pickedPoint.x,
            pick.pickedPoint.z
        );
    }

    /**
     * Get map tile key from map tile position.
     */
    private tileKey(x: number, y: number): string {
        return x + ':' + y;
    }

    /**
     * Get map tile position from pointer position.
     */
    public tileXY(pointerX: number, pointerY: number): BABYLON.Vector2 {
        let pick = this.pickXY(pointerX, pointerY);
        
        if (!pick || !pick.pickedPoint) {
            return BABYLON.Vector2.Zero();
        }

        return this.posToTile(new BABYLON.Vector2(
            pick.pickedPoint.x,
            pick.pickedPoint.z
        ));
    }

    /**
     * Get the map tile position from a map position.
     */
    private posToTile(pos: BABYLON.Vector2): BABYLON.Vector2 {
        return new BABYLON.Vector2(
            Math.floor(pos.x / this.tileSize),
            Math.floor(pos.y / this.tileSize)
        );
    }

    /**
     * Get a ground pick result from mouse position.
     */
    private pickXY(pointerX: number, pointerY: number) {
        return this.world.game.scene.pick(pointerX, pointerY, m => m === this.ground, true, this.world.game.camera);        
    }

    /**
     * Update the map tile material at a map tile position.
     * 
     * See also: updateTileUVs()
     */
    private updateTileSet(x: number, y: number, image: string) {
        let mesh = this.getMeshFor(x, y);

        // Offset to current mesh
        x = x - this.mapSize * Math.floor(x / this.mapSize);
        y = y - this.mapSize * Math.floor(y / this.mapSize);

        // Something has gone wrong
        if (x < 0 || y < 0 || x >= this.mapSize || y >= this.mapSize) {
            console.log('Tile index out of bounds');
            return;
        }

        let meshesPerTile = 2;
        let offset = mesh.subMeshes[(y * this.mapSize + x) * meshesPerTile];
        offset.materialIndex = this.getMaterialIndex(image);    
    }

    /**
     * Get the internal material index for a tile set image.
     */
    private getMaterialIndex(image: string): number {
        let i = this.materialIndexes.indexOf(image);

        if (i >= 0) {
            return i;
        }

        return this.addMaterial(image);
    }

    /**
     * Add a material for a tile set in order to use the tile set.
     */
    private addMaterial(image: string): number {
        let mapTilesTexture = new BABYLON.Texture(image, this.world.game.scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        mapTilesTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        mapTilesTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

        let material = new BABYLON.StandardMaterial('map texture', this.world.game.scene);
        material.ambientColor = new BABYLON.Color3(1, 1, 1);
        material.ambientTexture = mapTilesTexture;
        this.multimat.subMaterials.push(material);

        this.materialIndexes.push(image);

        return this.materialIndexes.length - 1;
    }

    /**
     * Update the UV coords for a map tile for a tile index.
     * 
     * See also: updateTileSet()
     */
    private updateTileUVs(x: number, y: number, index: number) {
        let mesh = this.getMeshFor(x, y);
        let uvs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind);

        // Offset to current mesh
        x = x - this.mapSize * Math.floor(x / this.mapSize);
        y = y - this.mapSize * Math.floor(y / this.mapSize);

        // Something has gone wrong
        if (x < 0 || y < 0 || x >= this.mapSize || y >= this.mapSize) {
            console.log('Tile index out of bounds');
            return;
        }

        let uvsPerTile = 8;
        let offset = (y * this.mapSize + x) * uvsPerTile;

        let i = 0;
        this.getTileUVs(index).forEach(uv => uvs[offset + i++] = uv);

        mesh.updateVerticesData(BABYLON.VertexBuffer.UVKind, uvs);
    }

    /**
     * Get the raw UV coordinates for a tile index.
     */
    private getTileUVs(index: number) {
        let s = 1/this.imageXTileCount;
        let x = s * (index % this.imageXTileCount);
        let y = s * (Math.floor(index / this.imageXTileCount));

        return [x, y, x + s, y, x, y + s, x + s, y + s];
    }

    /**
     * Get the internal mesh for a map tile position.
     */
    private getMeshFor(x: number, y: number): BABYLON.Mesh {
        x = Math.floor(x / this.mapSize);
        y = Math.floor(y / this.mapSize);

        let k = this.meshKey(x, y);

        if (k in this.meshes) {
            return this.meshes[k];
        }

        let mesh = this.createMapSegment();

        mesh.position.x = x * this.mapSize * this.tileSize + this.mapSize * this.tileSize / 2;
        mesh.position.z = y * this.mapSize * this.tileSize + this.mapSize * this.tileSize / 2;

        this.meshes[k] = mesh;

        return mesh;
    }

    /**
     * Generate a new mesh for a map segment.
     */
    private createMapSegment(): BABYLON.Mesh {
        let xmin = -this.tileSize * this.mapSize / 2;
        let zmin = -this.tileSize * this.mapSize / 2;
        let xmax = this.tileSize * this.mapSize / 2;
        let zmax = this.tileSize * this.mapSize / 2;

        let precision = {
            'w': 1,
            'h': 1
        };

        let subdivisions = {
            'h': this.mapSize,
            'w': this.mapSize
        };

        // Map mesh
        let map = BABYLON.Mesh.CreateTiledGround('map', xmin, zmin, xmax, zmax, subdivisions, precision, this.world.game.scene, true);
        map.material = this.multimat;

        // Needed letiables to set subMeshes
        let verticesCount = map.getTotalVertices();
        let tileIndicesLength = map.getIndices().length / (subdivisions.w * subdivisions.h);

        // Set subMeshes of the tiled ground
        map.subMeshes = [];
        let base = 0;
        let uvs = [];
        let grassTileUvs = this.getTileUVs(this.defaultTile.index);
        let mat = this.getMaterialIndex(this.defaultTile.image);
        
        for (let row = 0; row < subdivisions.h; row++) {
            for (let col = 0; col < subdivisions.w; col++) {
                let submesh = new BABYLON.SubMesh(mat, 0, verticesCount, base, tileIndicesLength, map);

                grassTileUvs.forEach(uv => uvs.push(uv));
                
                map.subMeshes.push(submesh);
                base += tileIndicesLength;
            }
        }

        map.updateVerticesData(BABYLON.VertexBuffer.UVKind, uvs);

        return map;
    }

    /**
     * Get the key for a mesh segment.
     */
    private meshKey(segmentX: number, segmentY: number): string {
        return segmentX + ':' + segmentY;
    }
}