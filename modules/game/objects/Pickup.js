import { quat, vec3, mat4 } from '../../../lib/gl-matrix-module.js';
import { GameObject } from './GameObject.js';

export class Pickup extends GameObject{
    constructor(node, type){

        super(node);
        
        this.type = type

    }
}
