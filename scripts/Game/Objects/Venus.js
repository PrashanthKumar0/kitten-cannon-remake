import SpriteAnimator from "../../Lib/Image/SpriteAnimator.js";

export default class Venus {
    constructor(canvas2D_context, sprite_sheet, position) {
        this.__ctx = canvas2D_context;
        this.__sprite_sheet = sprite_sheet;
        this.position = position;
        this.__animator = new SpriteAnimator("venus",this.__sprite_sheet);
        this.shouldAnimate = false;
        let frame = this.__animator.getCurrentFrame();
        let ar = frame.getWidth() / frame.getHeight();
        this.height = 200;
        this.width = this.height * ar;
    }
    startAnimation() {
        this.shouldAnimate = true;
    }
    update() {
        if (this.shouldAnimate) this.__animator.proceed();
    }
    draw() {
        let frame = this.__animator.getCurrentFrame();
        frame.draw(this.__ctx, this.position.x, this.position.y, this.width, this.height)
    }

}