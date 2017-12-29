import * as BABYLON from 'babylonjs';
import { Game } from '../game';

export class MapObject {

    private tileSize = .5;
    private mapSize = 10;
    private imageXTileCount = 8;
    private defaultTile = 20;

    private ground: BABYLON.Mesh;
    private meshes: Map<string, BABYLON.Mesh> = new Map();
    private multimat: BABYLON.MultiMaterial;
    private tiles: Map<string, number> = new Map();

    constructor(private game: Game) {
        this.ground = BABYLON.MeshBuilder.CreateGround('ground', {width: 100, height: 100, subdivisions: 1}, this.game.scene);
        this.ground.isPickable = true;
        this.ground.isVisible = false;

        // Map multimat
        this.multimat = new BABYLON.MultiMaterial('multi', this.game.scene);

        // Map texture
        let mapTilesTexture = new BABYLON.Texture('/assets/grassy_tiles.png', this.game.scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        mapTilesTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        mapTilesTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

        // Map material
        let material = new BABYLON.StandardMaterial('map texture', this.game.scene);
        material.ambientColor = new BABYLON.Color3(1, 1, 1);
        material.ambientTexture = mapTilesTexture;
        this.multimat.subMaterials.push(material);
    }

    public draw(pointerX: number, pointerY: number, index: number) {
        let pick = this.tileXY(pointerX, pointerY);

        this.game.text.text = pick.x + ', ' + pick.y;

        this.updateTileUVs(pick.x, pick.y, index);
    }

    public pickTile(pointerX: number, pointerY: number): number {
        let pick = this.tileXY(pointerX, pointerY);

        let vec = this.tileKey(pick.x, pick.y);
        
        if (this.tiles.has(vec)) {
            return this.tiles.get(vec);
        }

        return this.defaultTile;
    }

    private tileKey(x: number, y: number): string {
        return x + ':' + y;
    }

    private tileXY(pointerX: number, pointerY: number): BABYLON.Vector2 {
        let pick = this.pickXY(pointerX, pointerY);
        
        if (!pick || !pick.pickedPoint) {
            return BABYLON.Vector2.Zero();
        }

        return new BABYLON.Vector2(
            Math.floor(pick.pickedPoint.x / this.tileSize) + 5,
            Math.floor(pick.pickedPoint.z / this.tileSize) + 5
        );
    }

    private pickXY(pointerX: number, pointerY: number) {
        return this.game.scene.pick(pointerX, pointerY, m => m === this.ground, true, this.game.camera);        
    }

    private updateTileUVs(x: number, y: number, index: number) {
        let mesh = this.getMeshFor(x, y);
        let uvs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind);

        this.tiles.set(this.tileKey(x, y), index);

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
        let grassTileUvs = this.getTileUVs(this.defaultTile);
        
        for (let row = 0; row < subdivisions.h; row++) {
            for (let col = 0; col < subdivisions.w; col++) {
                let submesh = new BABYLON.SubMesh(0, 0, verticesCount, base, tileIndicesLength, map);

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