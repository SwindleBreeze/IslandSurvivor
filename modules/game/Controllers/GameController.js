import { vec3 } from "../../../../lib/gl-matrix-module.js";
import { Player } from "../objects/Player.js";
import { InputController } from "./InputController.js";
import { CollisionController } from "./CollisionController.js";

export class GameController{
    constructor()
    {
        this.player = null;
        this.camera = null;

        this.shouldUpdate = true;

        this.state = { wood: 0, house: 0 };

        this.inputController = new InputController();
        this.inputController.init();

        this.collisionController = new CollisionController(this);
        this.startTime = 0;
    }

    init(scene)
    {
        this.scene = scene;
        console.log(this.scene.nodes)

        for (let i=0; i < scene.nodes.length; i++) {          
            // console.log(scene.nodes[i].name);  
            if (scene.nodes[i].name == "Player") {this.player = new Player(scene.nodes[i]); console.log(this.player)};        
            if (scene.nodes[i].name == "Camera") this.camera = scene.nodes[i];
        }


        this.camera.translation = this.camera.translation = vec3.add(this.camera.translation,this.player.node.translation, [0,20,20])
        this.camera.rotation = [-0.3, 0, 0, 1];

        this.camera.camera.fov = 0.9;
        this.camera.camera.far = 60;
        this.camera.camera.near = 1;

        this.camera.camera.updateProjectionMatrix();

        this.collisionController.init(this.player);

        this.state.inputs = this.inputController.keys;
        this.shouldUpdate = true;
    }

    update()
    {
        if(this.shouldUpdate) {
            this.time = performance.now();
            let dt = (this.time - this.startTime) * 0.001;
            this.startTime = this.time;

            let playerPos = vec3.clone(this.player.node.translation);
            this.player.update(this,dt);
            let newPos = vec3.clone(this.player.node.translation);
            
            vec3.sub(playerPos, newPos, playerPos);

            this.camera.translation = vec3.add(this.camera.translation,this.camera.translation,playerPos);
            
            this.collisionController.update()
        }
    }
}