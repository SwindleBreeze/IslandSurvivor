import { quat, vec3, mat4 } from '../../../lib/gl-matrix-module.js';
import { GameObject } from './GameObject.js';

export class Player extends GameObject{
    constructor(node){

        super(node);
        
        this.dir = {
            up: [0, 0, -1],
            right: [1, 0, 0],
        }

        this.levels = {
            1: vec3.fromValues(0,1.8,0),
            2: vec3.fromValues(0,1.67,0)
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
            IDLE: "idle",
            RUNNING: "running"
        }

        this.collision = false;
        this.canChop = false;
        this.chopTarget = ""
        this.startChopTime = 0;
        this.chopReleased = true;

        this.pickups = {}
        this.children = []

        this.canBuild = false;
        this.buildTarget =""
        this.buildTimer = true;

        this.elevation = 1

        this.walkState={}
        this.walkStateAxe={}
        this.walkStateChop={}

        this.curPos="1"
        this.posCount=0

    }

    fillWalkState(node,name) {
        this.walkState[name]=node
    }

    fillWalkStateAxe(node,name) {
        this.walkStateAxe[name]=node
    }
    fillWalkStateChop(node,name) {
        this.walkStateChop[name]=node
    }

    setState(state){
        this.states.CURRENT_STATE = state;
    }

    setElevation(level,camera)
    {
        if(level == this.elevation) { return; }

        if(level == 1)
        {
            this.node.translation = vec3.sub(this.node.translation, this.node.translation, this.levels[1])
            camera.translation = vec3.sub(camera.translation, camera.translation, this.levels[1])
        }
        else if(level == 2)
        {
            if(this.elevation == 1)
            {
                this.node.translation = vec3.add(this.node.translation, this.node.translation, this.levels[1])
                camera.translation = vec3.add(camera.translation, camera.translation, this.levels[1])
            }
            else if(this.elevation == 3)
            {
                this.node.translation = vec3.sub(this.node.translation, this.node.translation, this.levels[2])
                camera.translation = vec3.sub(camera.translation, camera.translation, this.levels[2])
            }
        }
        else if(level == 3)
        {
            this.node.translation = vec3.add(this.node.translation, this.node.translation, this.levels[2])
            camera.translation = vec3.add(camera.translation, camera.translation, this.levels[2])
        }
        this.elevation = level
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
            this.setState(this.states.IDLE);
            this.velocity = [0,0,0]
        }
        else
        {
            this.setState(this.states.RUNNING);
            this.canChop = false;
            this.canBuild = false;
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
        if(game.state.inputs["KeyE"] && this.canChop && this.chopReleased && this.pickups["Axe"])
        {   
            this.setState(this.states.CHOPPING)
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

    build(game)
    {
        if(game.state.inputs["KeyE"] && this.canBuild && this.wood >=6 && this.buildTimer)
        {   
            console.log("can build")
            if(this.buildTarget == "Fire")
            {
                this.wood -=6
                game.fireLevel++; 
            }
            else if(this.buildTarget == "House")
            {
                this.wood -=6
                game.houseLevel++;
            }
            this.buildTimer = false;
            setTimeout(function()
            {
                this.buildTimer = true;
            }.bind(this), 500)
        }
    }
}