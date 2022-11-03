import SpriteAnimator from "../../Lib/Image/SpriteAnimator.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
// TODO : as its exact copy of Venus class use inheritance
export default class Trampoline {
    constructor(renderer, sprite_sheet, position) {
        this.__renderer = renderer;
        this.__sprite_sheet = sprite_sheet;
        this.position = position;
        this.__animator = new SpriteAnimator("trampoline", this.__sprite_sheet);
        this.shouldAnimate = false;
        let frame = this.__animator.getCurrentFrame();
        let ar = frame.getWidth() / frame.getHeight();
        this.height = 80;
        this.width = this.height * ar;
        this.relativeHitBox = {
            'position': new Vector2D(26, 26),
            'width': this.width/1.5,
            'height': this.height/2,
        };
    }
    startAnimation() {
        this.shouldAnimate = true;
    }
    update() {
        if (this.shouldAnimate) {
            this.__animator.proceed();
        }
    }
    getHitBox() {
        let pos = this.position.copy().add(this.relativeHitBox.position);
        return {
            'x': pos.x + 10,
            'y': pos.y + 8,
            'width': this.relativeHitBox.width - 20,
            'height': this.relativeHitBox.height - 16,
        };
    }
    draw() {
        // let box = this.getHitBox();
        let frame = this.__animator.getCurrentFrame();
        this.__renderer.drawFrame(frame,this.position.x, this.position.y, this.width, this.height);
        // this.__ctx.fillRect(box.x, box.y, box.width, box.height);        
    }

}
