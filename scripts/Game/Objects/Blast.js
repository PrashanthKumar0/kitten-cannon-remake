import SpriteAnimator from "../../Lib/Image/SpriteAnimator.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
// TODO : as its exact copy of Venus class use inheritance
export default class Blast {
    constructor(canvas2D_context, sprite_sheet, position) {
        this.__ctx = canvas2D_context;
        this.__sprite_sheet = sprite_sheet;
        this.position = position;
        // debugger;
        this.__animator = new SpriteAnimator("blast_round", this.__sprite_sheet);
        this.shouldAnimate = false;
        let frame = this.__animator.getCurrentFrame();
        let ar = frame.getWidth() / frame.getHeight();
        this.height = 140;
        this.width = this.height * ar;
    }
    startAnimation() {
        this.shouldAnimate = true;
    }
    update() {
        if (this.shouldAnimate) this.__animator.proceed();
    }
   draw() {
        // let box = this.getHitBox();
        // this.__ctx.fillRect(box.x, box.y, box.width, box.height);
        
        let frame = this.__animator.getCurrentFrame();
        frame.draw(this.__ctx, this.position.x, this.position.y, this.width, this.height)
        
    }

}