import { quat, vec3, mat4 } from '../../../lib/gl-matrix-module.js';
import { GameObject } from './GameObject.js';

export class Tree extends GameObject{
    constructor(node){

        super(node);
        
        this.health = 5;
        this.wood = 3;

        this.canBeHit = true;
        this.timer

    }

    hit(){
        if(this.canBeHit)
        {
            this.health--;
            if(this.health == 0){
                return true
            }
    
            this.canBeHit = false;
            
            this.timer = setTimeout(function()
            {
                this.canBeHit = true
            }.bind(this),1500)
            return false
        }

        if(this.health <= 0)
        {
            clearTimeout(this.timer)
        }
    }
}
