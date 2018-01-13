import * as BABYLON from 'babylonjs';
import { World } from '../world/world';

export class StatBar {

    private barHeight = .1;
    private barWidth = 1;

    private mesh: BABYLON.Mesh;
    private material: BABYLON.Material;
    private health = 1;
    private healthAnimated = 1;
    private offset = new BABYLON.Vector3(0, 0, 0);

    constructor(private world: World, image: string, isBehind: boolean = false) {
        this.mesh = new BABYLON.Mesh('statbar', this.world.game.scene);

        let s = 2 / 16;

        let vertexData = new BABYLON.VertexData();
        vertexData.positions = [
            -1, 0, -1, // 0
            -1, 0, 1, // 1
            1, 0, -1, // 2
            1, 0, 1, // 3

            -1 + s, 0, -1, // 4
            -1 + s, 0, 1, // 5

            1 - s, 0, -1, // 6
            1 - s, 0, 1, // 7
        ];
        vertexData.uvs = [
            0, 0, // 0
            0, 1, // 1
            1, 0, // 2
            1, 1, // 3
            s*4, 0, // 4
            s*4, 1, // 5
            1 - s*4, 0, // 6
            1 - s*4, 1, // 7
        ];
        vertexData.indices = [
            0, 1, 4,
            1, 4, 5,

            4, 5, 6,
            5, 6, 7,

            6, 7, 2,
            7, 2, 3,
        ];    
        vertexData.normals = [
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0
        ];
        vertexData.applyToMesh(this.mesh, true);

        let texture = new BABYLON.Texture(image, this.world.game.scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        let material = new BABYLON.StandardMaterial('statbar', this.world.game.scene);
        material.ambientColor = new BABYLON.Color3(1, 1, 1);
        material.ambientTexture = texture;
        material.opacityTexture = texture;
        material.backFaceCulling = false;
        this.mesh.material = material;

        this.mesh.position.y = isBehind ? .9 : 1;
        this.mesh.scaling.z = this.barHeight;
        this.mesh.scaling.x = this.barWidth;
    }

    public update() {
        let camera = this.world.game.camera;
        this.mesh.position.x = (camera.position.x + camera.orthoLeft) + this.mesh.scaling.x + .1;
        this.mesh.position.z = (camera.position.z + camera.orthoTop) - this.mesh.scaling.z  - .1;
        this.mesh.position.addInPlace(this.offset);

        let diff = Math.abs(this.healthAnimated - this.health);
        if (diff) {
            if (diff < 0.01) {
                this.healthAnimated = this.health;
            } else {
                this.healthAnimated = this.healthAnimated * 0.9 + 0.1 * this.health;
            }

            this.updateMeshObject();
        }
    }

    public setOffset(numberOfBarWidths: number) {
        this.offset.z = -numberOfBarWidths * ((2 / 16 * 2) + this.barHeight / 2);
    }

    public setHealth(health: number) {
        this.health = health;
    }

    public updateMeshObject() {
        let s = 2 / 16;

        if (this.healthAnimated < s) {
            s /= 4;
        }
        
        let h = Math.min(1, Math.max(s, this.healthAnimated)) * 2;
        
        let positions = [
            -1, 0, -1, // 0
            -1, 0, 1, // 1
            -1 + h, 0, -1, // 2
            -1 + h, 0, 1, // 3

            -1 + s, 0, -1, // 4
            -1 + s, 0, 1, // 5

            -1 + h - s, 0, -1, // 6
            -1 + h - s, 0, 1, // 7
        ];

        this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    }
}