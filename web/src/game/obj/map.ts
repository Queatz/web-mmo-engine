import * as BABYLON from 'babylonjs';
import { Game } from '../game';
import Config from '../config';
import { MapTile } from './maptile';
import { BaseObject } from './baseobject';

export class MapObject {

    private tileSize = .5;
    private mapSize = 10;
    private imageXTileCount = 8;
    private defaultTile = new MapTile('/assets/grassy_tiles.png', 20);

    private tileSetsNoCollision: Map<string, Set<number>> = new Map();
    
    private ground: BABYLON.Mesh;
    private meshes: Map<string, BABYLON.Mesh> = new Map();
    private multimat: BABYLON.MultiMaterial;
    private tiles: Map<string, MapTile> = new Map();

    private objs = new Set<BaseObject>();

    private materialIndexes = [];

    constructor(private game: Game) {

        this.tileSetsNoCollision.set(Config.tileSets[0], new Set<number>([
            20, 24, 25, 26, 27, 33, 35, 36, 40, 41, 42, 43, 44, 46, 48, 49, 50, 51, 56, 57, 58, 59
        ]));

        this.ground = BABYLON.MeshBuilder.CreateGround('ground', {width: 100, height: 100, subdivisions: 1}, this.game.scene);
        this.ground.isPickable = true;
        this.ground.isVisible = false;

        // Map multimat
        this.multimat = new BABYLON.MultiMaterial('multi', this.game.scene);

        // Map texture
        this.addMaterial('/assets/grassy_tiles.png');
    }

    public add(obj: BaseObject) {
        this.objs.add(obj);
    }

    public update() {
        this.objs.forEach(obj => {
            obj.previousPos.copyFrom(obj.sprite.position);
            obj.update();
            this.collide(obj);
        });
    }
    
    public collide(obj: BaseObject) {
        let tile = this.getTileAt(this.posToTile(new BABYLON.Vector2(
            obj.sprite.position.x,
            obj.sprite.position.z
        )));
        
        if (!this.isCollideTile(tile)) {
            return;
        }

        // Check x
        
        tile = this.getTileAt(this.posToTile(new BABYLON.Vector2(
            obj.sprite.position.x,
            obj.previousPos.z
        )));

        if (!this.isCollideTile(tile)) {
            obj.sprite.position.z = obj.previousPos.z;
            return;
        }

        // Check y
        
        tile = this.getTileAt(this.posToTile(new BABYLON.Vector2(
            obj.previousPos.x,
            obj.sprite.position.z
        )));

        if (!this.isCollideTile(tile)) {
            obj.sprite.position.x = obj.previousPos.x;
            return;
        }

        obj.sprite.position.copyFrom(obj.previousPos);
    }

    public isCollideTile(tile: MapTile): boolean {
        return this.tileSetsNoCollision.has(tile.image) && !this.tileSetsNoCollision.get(tile.image).has(tile.index);
    }

    public draw(pointerX: number, pointerY: number, tileSet: string, index: number) {
        let pick = this.tileXY(pointerX, pointerY);

        this.game.text.text = pick.x + ', ' + pick.y;

        this.tiles.set(this.tileKey(pick.x, pick.y), new MapTile(tileSet, index));        
        this.updateTileSet(pick.x, pick.y, tileSet);
        this.updateTileUVs(pick.x, pick.y, index);
    }

    public pickTile(pointerX: number, pointerY: number): MapTile {
        let pick = this.tileXY(pointerX, pointerY);

        return this.getTileAt(pick);
    }

    public getTileAt(pos: BABYLON.Vector2): MapTile {
        let vec = this.tileKey(pos.x, pos.y);
        
        if (this.tiles.has(vec)) {
            return this.tiles.get(vec);
        }

        return this.defaultTile;
    }

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

    private tileKey(x: number, y: number): string {
        return x + ':' + y;
    }

    private tileXY(pointerX: number, pointerY: number): BABYLON.Vector2 {
        let pick = this.pickXY(pointerX, pointerY);
        
        if (!pick || !pick.pickedPoint) {
            return BABYLON.Vector2.Zero();
        }

        return this.posToTile(new BABYLON.Vector2(
            pick.pickedPoint.x,
            pick.pickedPoint.z
        ));
    }

    private posToTile(pos: BABYLON.Vector2): BABYLON.Vector2 {
        return new BABYLON.Vector2(
            Math.floor(pos.x / this.tileSize) + 5,
            Math.floor(pos.y / this.tileSize) + 5
        );
    }

    private pickXY(pointerX: number, pointerY: number) {
        return this.game.scene.pick(pointerX, pointerY, m => m === this.ground, true, this.game.camera);        
    }

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

    private getMaterialIndex(image: string): number {
        let i = this.materialIndexes.indexOf(image);

        if (i >= 0) {
            return i;
        }

        return this.addMaterial(image);
    }

    private addMaterial(image: string): number {
        let mapTilesTexture = new BABYLON.Texture(image, this.game.scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        mapTilesTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        mapTilesTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

        let material = new BABYLON.StandardMaterial('map texture', this.game.scene);
        material.ambientColor = new BABYLON.Color3(1, 1, 1);
        material.ambientTexture = mapTilesTexture;
        this.multimat.subMaterials.push(material);

        this.materialIndexes.push(image);

        return this.materialIndexes.length - 1;
    }

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

    private getTileUVs(index: number) {
        let s = 1/this.imageXTileCount;
        let x = s * (index % this.imageXTileCount);
        let y = s * (Math.floor(index / this.imageXTileCount));

        return [x, y, x + s, y, x, y + s, x + s, y + s];
    }

    private getMeshFor(x: number, y: number): BABYLON.Mesh {
        x = Math.floor(x / this.mapSize);
        y = Math.floor(y / this.mapSize);

        let k = this.meshKey(x, y);

        if (k in this.meshes) {
            return this.meshes[k];
        }

        let mesh = this.createMapSegment();

        mesh.position.x = x * this.mapSize * this.tileSize;
        mesh.position.z = y * this.mapSize * this.tileSize;

        this.meshes[k] = mesh;

        return mesh;
    }

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
        let map = BABYLON.Mesh.CreateTiledGround('map', xmin, zmin, xmax, zmax, subdivisions, precision, this.game.scene, true);
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

    private meshKey(segmentX: number, segmentY: number): string {
        return segmentX + ':' + segmentY;
    }
}