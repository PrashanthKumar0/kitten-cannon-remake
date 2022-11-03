import SpriteAnimator from "../../Lib/Image/SpriteAnimator.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
// TODO : as its exact copy of Venus class use inheritance
export default class Bomb {
    constructor(renderer, sprite_sheet, position) {
        this.__renderer = renderer;
        this.__sprite_sheet = sprite_sheet;
        this.position = position;
        this.__tnt_animator = new SpriteAnimator("tnt", this.__sprite_sheet);
        this.__blast_animator = new SpriteAnimator("tnt_blast", this.__sprite_sheet);
        this.shouldAnimate = false;
        let frame = this.__tnt_animator.getCurrentFrame();
        let ar = frame.getWidth() / frame.getHeight();
        this.height = 160;
        this.width = this.height * ar;
        this.relativeHitBox = {
            'position': new Vector2D(this.width / 4, this.height / 2),
            'width': this.width / 2,
            'height': this.height / 2,
        };
    }
    startAnimation() {
        this.shouldAnimate = true;
    }
    update() {
        if (this.shouldAnimate) {
            this.__tnt_animator.proceed();
            this.__blast_animator.proceed();
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
        // this.__ctx.fillRect(box.x, box.y, box.width, box.height);        
        let frame = this.__blast_animator.getCurrentFrame();

        this.__renderer.drawFrame(frame, this.position.x, this.position.y, this.width, this.height);

        frame = this.__tnt_animator.getCurrentFrame();
        this.__renderer.drawFrame(frame, this.position.x, this.position.y, this.width, this.height);
    }

}
