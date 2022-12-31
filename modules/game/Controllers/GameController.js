import { vec3 } from "../../../../lib/gl-matrix-module.js";
import { Player } from "../objects/Player.js";
import { InputController } from "./InputController.js";
import { CollisionController } from "./CollisionController.js";
import { Tree } from "../objects/Tree.js";
import { UIController } from "./UIController.js";
import { Pickup } from "../objects/Pickup.js";

export class GameController{
    constructor()
    {
        this.player = null;
        this.camera = null;
        this.trees = []
        this.pickups = []

        this.shouldUpdate = true;

        this.state = { wood: 0, house: 0 };

        this.inputController = new InputController();
        this.inputController.init();

        this.collisionController = new CollisionController(this);
        this.startTime = 0;

        this.uiController = new UIController(this)
    }

    init(scene, twoD)
    {
        this.scene = scene;
        this.ctx2d = twoD

        for (let i=0; i < scene.nodes.length; i++) {
            if (scene.nodes[i].name == "Player") {this.player = new Player(scene.nodes[i]); console.log(this.player)};        
            if (scene.nodes[i].name == "Camera") this.camera = scene.nodes[i];
            if (scene.nodes[i].name.startsWith("TreeStump")) this.trees.push(new Tree(scene.nodes[i]));
            if (scene.nodes[i].name.startsWith("Pickup")) 
            {
                let parts = scene.nodes[i].name.split('_');
                this.pickups.push(new Pickup(scene.nodes[i], parts[1]));
            }
        }


        this.camera.translation = this.camera.translation = vec3.add(this.camera.translation,this.player.node.translation, [0,20,20])
        this.camera.rotation = [-0.3, 0, 0, 1];
        this.camera.canMove = true
        this.camera.camera.fov = 0.8;
        this.camera.camera.far = 240;
        this.camera.camera.near = 1;

        this.camera.camera.updateProjectionMatrix();

        this.collisionController.init(this.player, this.camera);

        this.state.inputs = this.inputController.keys;
        this.shouldUpdate = true;

        //start UI
        this.uiController.init(this.player, this.ctx2d)
        console.log(this.uiController)
        console.log(this.pickups)
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

            if(this.player.chop(this))
            {
                this.scene.deleteNode(this.player.chopTarget);
                this.trees.splice(this.trees.indexOf(this.trees.find(element => element.node == this.player.chopTarget)),1);
                console.log(this.player.wood)
            }

            this.collisionController.update()
            vec3.sub(playerPos, newPos, playerPos);
            this.camera.prevPos = this.camera.translation
            if(this.camera.canMove)
            {
                this.camera.translation = vec3.add(this.camera.translation,this.camera.translation,playerPos);
            }
            this.uiController.update()
        }
    }
}