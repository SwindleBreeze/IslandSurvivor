export class UIController {
    constructor(game) {
        this.game = game;
    }

    init (player, ctx2d) {

        this.player = player;
        this.ctx = ctx2d;
        this.chopDisplay = true
        this.font = new FontFace('myFont','url(../../../fonts/old_pixel-7.ttf)')
        this.font.load().then(function(font){
            document.fonts.add(font);
            console.log('Font loaded');

            this.ctx.font = "65px myFont";
            
        }.bind(this));
        console.log(this.game.scene)
        this.pickups = []
        this.tutorial = true;

    }

    update() {
        this.ctx.clearRect(0, 0, 900, 400);
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.font = "50px myFont";
        this.ctx.fillText("Wood: ", 15, 50);
        this.ctx.fillText(this.player.wood, 120, 50);
        let chopTarget = this.game.trees.find(element => element.node == this.player.chopTarget)
        if(this.player.canChop && chopTarget!= null && this.player.pickups["Axe"])
        {
            this.ctx.fillStyle = "rgba(252, 255, 0, 0.8)";
            if(this.tutorial)
            {
                this.ctx.fillText("HOLD STILL AND PRESS 'E' TO CHOP", 200, 200);
                this.ctx.fillText("MOVEMENT KEYS CANCEL THE CHOP", 200, 250);
                if(this.player.wood != 0)
                {
                    this.tutorial = false
                }
            }
            else
            {
                this.ctx.fillText("HOLD STILL AND PRESS 'E' TO CHOP", 200, 200);
            }
            if(this.game.state.inputs['KeyE'] && this.chopDisplay)
            {
                if(chopTarget!=null && !chopTarget.canBeHit)
                {
                    setTimeout(function(){
                        this.ctx.clearRect(550,350,800,540)
                        this.chopDisplay = true
                    }.bind(this),1500)
                    let randy = Math.floor(Math.random() * 500) + 400;
                    let randx = Math.floor(Math.random() * 650) + 550;
                    this.ctx.fillStyle = "rgba(113,47,47,1)";
                    this.ctx.fillText("-1", randx, randy);
                    this.chopDisplay = false
                }
            }
        }
        else if(this.player.canChop && chopTarget!= null && !this.player.pickups["Axe"])
        {
            this.ctx.fillStyle = "rgba(252, 255, 0, 0.8)";
            this.ctx.fillText("FIND AN AXE", 200, 200);
        }

        if(this.player.canBuild && this.player.buildTarget != "")
        {
            this.ctx.fillStyle = "rgba(252, 255, 0, 0.8)";
            let neededWood = 6-this.player.wood
            if(this.player.buildTarget == "House")
                this.ctx.fillText("HOLD STILL AND PRESS 'E' TO BUILD HOUSE", 100, 200);
            else if(this.player.buildTarget == "Fire")
                this.ctx.fillText("HOLD STILL AND PRESS 'E' TO BUILD FIRE", 100, 200);
            if(neededWood >0)
            {
                this.ctx.fillText("WOOD REQUIRED FOR NEXT LEVEL: "+ neededWood, 100, 250); 
            }
            else
            {
                this.ctx.fillText("YOU HAVE ENOUGH WOOD FOR NEXT LEVEL", 100, 250); 
            }
        }

    }

    pickup()
    {
        for(let [key, value] of Object.entries(this.player.pickups))
        {
            console.log(key)
            console.log(value)
        }
        this.ctx.clearRect(0, 0, 1200, 400);
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.font = "50px myFont";
        this.ctx.fillText("PICKED UP", 500, 200);
        this.ctx.fillText(name, 550, 200);
    }
}