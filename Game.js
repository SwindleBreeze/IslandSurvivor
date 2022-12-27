import { Application } from './modules/engine/Application.js';

import { GLTFLoader } from './modules/engine/GLTFLoader.js';
import { Renderer } from './modules/engine/Renderer.js';

import { GameController } from './modules/game/Controllers/GameController.js';

export class Game extends Application{
    async start(){
        this.Renderer = new Renderer(this.gl)
        this.Loader = new GLTFLoader();

        await this.Loader.load('./scenes/gltf/island.gltf');

        let sceneCamera = await this.Loader.loadNode("Camera")
        let scene = await this.Loader.loadScene(this.Loader.defaultScene)

        console.log(scene)
        
        this.Renderer.prepareScene(scene);
        this.GameController = new GameController
    }
}