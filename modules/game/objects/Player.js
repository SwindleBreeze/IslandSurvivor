import { quat, vec3, mat4 } from '../../../lib/gl-matrix-module.js';
import { GameObject } from './GameObject.js';

export class Player extends GameObject{
    constructor(node){

        super(node);
        
        this.dir = {
            up: [0, 0, -1],
            right: [1, 0, 0],
        }
        this.direction

        this.acceleration = 10;
        this.maxSpeed = 15;

        this.pitch = -1.5;
        this.yaw = 0;
        this.velocity = [0, 0, 0];

        this.prevPos;

        this.wood = 0;
        this.states = {
            CURRENT_STATE: "idle",
            CHOPPING: "chooping",
            RUNNING: "running"
        }

        this.collision = false;
        this.canChop = false;
        this.chopTarget = ""
        this.startChopTime = 0;
    }

    setState(state){
        this.states.CURRENT_STATE = state;
    }


    update(game, dt){

        let accel = vec3.create();

        if(game.state.inputs['KeyW']) { 
            vec3.add(accel, accel, this.dir.up); 
            this.setState(this.states.RUNNING);
            this.yaw = 3.15
        }
        if(game.state.inputs['KeyD']) { 
            vec3.add(accel, accel, this.dir.right); 
            this.setState(this.states.RUNNING)
            this.yaw = 1.75
        }
        if(game.state.inputs['KeyS']) { 
            vec3.sub(accel, accel, this.dir.up); 
            this.setState(this.states.RUNNING);
            this.yaw = 0
        }
        if(game.state.inputs['KeyA']) { 
            vec3.sub(accel, accel, this.dir.right); 
            this.setState(this.states.RUNNING)
            this.yaw = -1.75
        }

        if (game.state.inputs['KeyA'] && game.state.inputs['KeyW']){
            this.yaw = -2.5
        }
        if (game.state.inputs['KeyA'] && game.state.inputs['KeyS']){
            this.yaw = -1
        }
        if (game.state.inputs['KeyD'] && game.state.inputs['KeyW']){
            this.yaw = 2.5
        }
        if (game.state.inputs['KeyD'] && game.state.inputs['KeyS']){
            this.yaw = 1
        }

        vec3.scaleAndAdd(this.velocity, this.velocity,accel, dt*this.acceleration)
        
        if(!game.state.inputs['KeyW'] && !game.state.inputs['KeyS'] && !game.state.inputs['KeyD'] && !game.state.inputs['KeyA']) 
        {
            this.velocity = [0,0,0]
        }
        else
        {
            this.canChop = false;
        }
        let speed = vec3.length(this.velocity)
        if(speed > this.maxSpeed) vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);

        this.prevPos = vec3.clone(this.node.translation)
        this.node.translation = vec3.scaleAndAdd(this.node.translation, this.node.translation, this.velocity, dt);

        let rotation = quat.create();
        quat.rotateY(rotation, rotation, this.yaw);
        quat.rotateX(rotation, rotation, this.pitch);
        this.node.rotation = rotation;
    }

    chop(game)
    {
        if(game.state.inputs["KeyE"] && this.canChop)
        {
            let tree = game.trees.find(element => element.node == this.chopTarget)
            if(tree != null)
            {
                let result = tree.hit()
                if(result)
                {
                    this.wood += tree.wood
                    return true
                }
            }
            return false
        }
    }
}