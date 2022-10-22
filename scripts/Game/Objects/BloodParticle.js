export default class bloodParticle {
    constructor(canvas2D_context, sprite_sheet, position) {
        this.position = position;
        this.__sprite_sheet = sprite_sheet;
        this.__ctx = canvas2D_context;
        this.__frame=sprite_sheet.getFrame("blood/2.png");
        let ar = this.__frame.getWidth() / this.__frame.getHeight();
        this.height = 28;
        this.width = ar * this.height;
    }
    draw() {
        this.__ctx.imageSmoothingEnabled=false;
        let frame = this.__frame;
        frame.draw(this.__ctx, this.position.x, this.position.y, this.width, this.height);
        this.__ctx.imageSmoothingEnabled=true;
    }
}