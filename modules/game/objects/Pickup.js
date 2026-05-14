import { GameObject } from './GameObject.js';

export class Pickup extends GameObject{
    constructor(node, type){

        super(node);
        
        this.type = type

    }
}
