export default class bloodParticle {
    constructor(renderer, sprite_sheet, position) {
        this.position = position;
        this.__sprite_sheet = sprite_sheet;
        this.__renderer = renderer;
        this.__frame = sprite_sheet.getFrame("blood/2.png");
        let ar = this.__frame.getWidth() / this.__frame.getHeight();
        this.height = 28;
        this.width = ar * this.height;
    }
    draw() {
        let frame = this.__frame;
        this.__renderer.drawFrame(frame, this.position.x, this.position.y, this.width, this.height);
    }
}