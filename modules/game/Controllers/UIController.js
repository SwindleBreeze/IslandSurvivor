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

    }

    update() {

        this.ctx.clearRect(0, 0, 700, 350);
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.font = "50px myFont";
        this.ctx.fillText("Wood: ", 15, 50);
        this.ctx.fillText(this.player.wood, 120, 50);
        let chopTarget = this.game.trees.find(element => element.node == this.player.chopTarget)
        if(this.player.canChop && chopTarget!= null && this.player.pickups["Axe"])
        {
            this.ctx.fillStyle = "rgba(47,47,47,0.57)";
            this.ctx.fillText("PRESS 'E' TO CHOP", 200, 200);
            if(this.game.state.inputs['KeyE'] && this.chopDisplay)
            {
                if(chopTarget!=null && !chopTarget.canBeHit)
                {
                    setTimeout(function(){
                        this.ctx.clearRect(550,350,800,540)
                        this.chopDisplay = true
                    }.bind(this),1500)
                    let randy = Math.floor(Math.random() * 500) + 380;
                    let randx = Math.floor(Math.random() * 650) + 550;
                    this.ctx.fillStyle = "rgba(47,47,47,1)";
                    this.ctx.fillText("-1", randx, randy);
                    this.chopDisplay = false
                }
            }
        }
        else if(this.player.canChop && chopTarget!= null && !this.player.pickups["Axe"])
        {
            this.ctx.fillStyle = "rgba(47,47,47,0.57)";
            this.ctx.fillText("FIND AN AXE", 200, 200);
        }
    }
}