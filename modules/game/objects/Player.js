import { quat, vec3, mat4 } from '../../../lib/gl-matrix-module.js';
import { GameObject } from './GameObject.js';

export class Player extends GameObject{
    constructor(node){

        super(node);
        
        this.dir = {
            up: [0, 0, -1],
            right: [1, 0, 0],
        }

        this.acceleration = 5;
        this.maxSpeed = 5;

        this.pitch = -1.5;
        this.yaw = 0;
        this.velocity = [0, 0, 0];

        this.wood = 0;

        this.states = {
            CURRENT_STATE: "idle",
            CHOPPING: "chooping",
            RUNNING: "running"
        }
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
        
        if(!game.state.inputs['KeyW'] && !game.state.inputs['KeyS'] && !game.state.inputs['KeyD'] && !game.state.inputs['KeyA']) this.velocity = [0,0,0];

        let speed = vec3.length(this.velocity)
        if(speed > this.maxSpeed) vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);

        this.node.translation = vec3.scaleAndAdd(this.node.translation, this.node.translation, this.velocity, dt);
        // this.node.translation = vec3.add(this.node.translation, this.node.translation, gravity);
        let rotation = quat.create();
        quat.rotateY(rotation, rotation, this.yaw);
        quat.rotateX(rotation, rotation, this.pitch);
        this.node.rotation = rotation;
    }
}