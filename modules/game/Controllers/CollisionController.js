import { vec3, mat4 } from "../../../../lib/gl-matrix-module.js";
import { Player } from "../objects/Player.js";
export class CollisionController {
    constructor(game) {
        this.game = game;
        this.interactibles = {}
        this.currLevel = 0;

        this.shouldUpdate = true;
    }

    init (player, camera) {
        this.player = player;
        this.camera = camera;
        console.log(this.game.scene)
    }

    checkCollision(a,b) {
        return (
            a.node.translation[0] - a.node.scale[0] + 1.25 <= b.translation[0] + b.scale[0] &&
            a.node.translation[0] + a.node.scale[0] - 1.25 >= b.translation[0] - b.scale[0] &&
            a.node.translation[1] - a.node.scale[1] + 1.25 <= b.translation[1] + b.scale[1] &&
            a.node.translation[1] + a.node.scale[1] - 1.25 >= b.translation[1] - b.scale[1] &&
            a.node.translation[2] - a.node.scale[2] + 1.25 <= b.translation[2] + b.scale[2] &&
            a.node.translation[2] + a.node.scale[2] - 1.25 >= b.translation[2] - b.scale[2]
        );
    }

    checkHeight()
    {
        let level = 0;
        for(let node of this.game.scene.nodes)
        {
            if(node.name.startsWith("Level1"))
            {
                if(this.player.node.translation[0] - this.player.node.scale[0] + 1.25 <= node.translation[0] + node.scale[0] &&
                this.player.node.translation[0] + this.player.node.scale[0] - 1.25 >= node.translation[0] - node.scale[0] &&
                this.player.node.translation[2] - this.player.node.scale[2] + 1.25 <= node.translation[2] + node.scale[2] &&
                this.player.node.translation[2] + this.player.node.scale[2] - 1.25 >= node.translation[2] - node.scale[2])
                {
                    if(level < 1)
                    {
                        level = 1
                    }
                }
            }
            else if(node.name.startsWith("Level2"))
            {
                if(this.player.node.translation[0] - this.player.node.scale[0] + 1.25 <= node.translation[0] + node.scale[0] &&
                this.player.node.translation[0] + this.player.node.scale[0] - 1.25 >= node.translation[0] - node.scale[0] &&
                this.player.node.translation[2] - this.player.node.scale[2] + 1.25 <= node.translation[2] + node.scale[2] &&
                this.player.node.translation[2] + this.player.node.scale[2] - 1.25 >= node.translation[2] - node.scale[2])
                {
                    if(level < 2)
                    {
                        level = 2
                    }
                }
            }
            else if(node.name.startsWith("Level3"))
            {
                if(this.player.node.translation[0] - this.player.node.scale[0] + 1.25 <= node.translation[0] + node.scale[0] &&
                this.player.node.translation[0] + this.player.node.scale[0] - 1.25 >= node.translation[0] - node.scale[0] &&
                this.player.node.translation[2] - this.player.node.scale[2] + 1.25 <= node.translation[2] + node.scale[2] &&
                this.player.node.translation[2] + this.player.node.scale[2] - 1.25 >= node.translation[2] - node.scale[2])
                {
                    if(level < 3)
                    {
                        level = 3
                    }
                }
            }
        }

        return level
    }

    update() {
        this.camera.canMove = true
        let level = 0;
        for (let node of this.game.scene.nodes)
        {
            if(node != null && node.name != "Player" && node.name!="WGTS_rig" && node.name!="Plane"){
                let collision = this.checkCollision(this.player, node)
                if(collision && node.name.startsWith("Level"))
                {
                    level = this.checkHeight();
                }
                else if(collision){
                    console.log(node.name)
                    this.player.collision = true
                    if(this.player.prevPos != null)
                    {
                        this.player.node.translation = this.player.prevPos
                        this.camera.translation = this.camera.prevPos
                        this.camera.canMove = false
                    }
                }

                if(collision && node.name.startsWith("Pickup"))
                {
                    let parts = node.name.split("_")
                    this.player.pickups[parts[1]] = true
                    this.player.children.push(node)
                    this.game.scene.deleteNode(node)
                }

                if(collision && node.name.startsWith("TreeStump"))
                {
                    this.player.canChop = true;
                    this.player.chopTarget = node
                    this.interactibles[node.name] = true;
                }
                else if(!collision && node.name.startsWith("TreeStump"))
                {
                    this.interactibles[node.name] = false;
                }
            }
        }
        if(level == 0)
        {
            level = this.checkHeight()
        }
        if(level == 0)
        {
            console.log("WRONG")
        }
        else
        {
            this.player.setElevation(level, this.camera)
        }
    }
}