import { Application } from "./modules/engine/Application.js";

import { GLTFLoader } from "./modules/engine/GLTFLoader.js";
import { Renderer } from "./modules/engine/Renderer.js";
import { GameController } from "./modules/game/Controllers/GameController.js";

export class Game extends Application {
  async start() {
    this.renderer = new Renderer(this.gl);
    this.Loader = new GLTFLoader();

    await this.Loader.load("./assets/scenes/LowPolyIsland3best1.gltf");

    this.camera = await this.Loader.loadNode("Camera");
    this.light = await this.Loader.loadNode("Light");

    this.scene = await this.Loader.loadScene(this.Loader.defaultScene);

    if (!this.scene || !this.camera) {
      throw new Error("Scene or Camera not present in glTF");
    }

    if (!this.camera.camera) {
      throw new Error("Camera node does not contain a camera reference");
    }

    this.light.color = [255, 255, 255];
    this.light.intensity = 1;
    this.light.attenuation = [0.001, 0, 0.3];

    this.renderer.prepareScene(this.scene);
    this.gameController = new GameController();
    this.gameController.init(this.scene, this.ui);
  }

  render() {
    this.renderer.render(this.scene, this.camera, this.light, this.gameController);
  }

  resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const aspectRatio = w / h;

    if (this.camera.camera) {
        this.camera.camera.aspect = aspectRatio;
        this.camera.camera.updateProjectionMatrix();
    }
  }

  update() { 
    if (this.gameController.shouldUpdate) this.gameController.update();
  }
}
