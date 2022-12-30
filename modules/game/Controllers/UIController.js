export class UIController {
    constructor(game) {
        this.game = game;
        this.font = new FontFace('myFont','url(../../../fonts/old_pixel-7.ttf)')
        this.font.load().then(function(font){
            document.fonts.add(font);
            console.log('Font loaded');
        });
    }

    init (player, ctx2d) {

        this.player = player;
        this.ctx = ctx2d;
        console.log(this.game.scene)

        this.ctx.font = "50px myFont";
        this.ctx.fillText("Wood: ", 10, 50);
    }
}