import SpriteAnimator from "../../Lib/Image/SpriteAnimator.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
// TODO : as its exact copy of Venus class use inheritance
export default class Spike {
    constructor(canvas2D_context, sprite_sheet, position) {
        this.__ctx = canvas2D_context;
        this.__sprite_sheet = sprite_sheet;
        this.position = position;
        this.__animator = new SpriteAnimator("spikes", this.__sprite_sheet);
        this.shouldAnimate = false;
        let frame = this.__animator.getCurrentFrame();
        let ar = frame.getWidth() / frame.getHeight();
        this.height = 140;
        this.width = this.height * ar;
        this.relativeHitBox = {
            'position': new Vector2D(110, 32),
            'width': 110,
            'height': this.height-50,
        };
    }
    startAnimation() {
        this.shouldAnimate = true;
    }
    update() {
        if (this.shouldAnimate) this.__animator.proceed();
    }
    getHitBox() {
        let pos = this.position.copy().add(this.relativeHitBox.position);
        return {
            'x': pos.x,
            'y': pos.y,
            'width': this.relativeHitBox.width,
            'height': this.relativeHitBox.height,
        };
    }
    draw() {
        // let box = this.getHitBox();
        // this.__ctx.fillRect(box.x, box.y, box.width, box.height);
        
        let frame = this.__animator.getCurrentFrame();
        frame.draw(this.__ctx, this.position.x, this.position.y, this.width, this.height)
        
    }

}