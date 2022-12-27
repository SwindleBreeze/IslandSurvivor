import { Application } from './modules/engine/Application.js';

import { GLTFLoader } from './modules/engine/GLTFLoader.js';
import { Renderer } from './modules/engine/Renderer.js';
import { Node } from './modules/engine/Node.js';
import { GameController } from './modules/game/Controllers/GameController.js';

//JUSTI IS GHEJ
export class Game extends Application{
    async start(){
        this.renderer = new Renderer(this.gl)
        this.Loader = new GLTFLoader();

        await this.Loader.load('./scenes/gltf/testIsland.gltf');

        this.camera = await this.Loader.loadNode("Camera")
        this.light = await this.Loader.loadNode("Light")
        console.log(this.light)
        this.scene = await this.Loader.loadScene(this.Loader.defaultScene)

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        //Create sun object
        this.sun = new Node();
        this.sun.position = [0, 2, 1];
        this.sun.color = [255, 255, 255];
        this.sun.intensity = 1;
        this.sun.attenuation = [0.001, 0, 0.3];


        console.log(this.scene)
        
        this.renderer.prepareScene(this.scene);
        this.GameController = new GameController
    }

    render()
    {
        this.renderer.render(this.scene, this.camera, this.sun);
    }

    resize(width, height) {
        this.camera.camera.aspect = width / height;
        this.camera.camera.updateProjectionMatrix();
    }
}