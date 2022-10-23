import SpriteAnimator from "../../Lib/Image/SpriteAnimator.js";
import SpriteSheet from "../../Lib/Image/SpriteSheet.js";
import { randomInt } from "../../Lib/Math/functions.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
// TODO : as its exact copy of Venus class use inheritance
export default class Balloon {
    constructor(canvas2D_context, sprite_sheet, position) {
        this.__ctx = canvas2D_context;
        this.__sprite_sheet = sprite_sheet;
        this.position = position;
        this.__animator = new SpriteAnimator("baloon_blast", this.__sprite_sheet);
        this.shouldAnimate = false;

        let frame_names = sprite_sheet.getAnimationFrames("baloon");
        this.frameIndex = randomInt(0, frame_names.length - 1);

        this.__frame = this.__sprite_sheet.getFrame(frame_names[this.frameIndex]);

        this.vely = 10;
        this.exploded = false;
        this.__animator.onComplete = () => {
            this.exploded = true;
        };


        let frame = this.__animator.getCurrentFrame();
        let ar = frame.getWidth() / frame.getHeight();
        this.height = 190;
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
            this.__animator.proceed();
        }
        if (this.exploded) {
            this.position.y -= this.vely;
        }
    }
    getHitBox() {
        let pos = this.position.copy().add(this.relativeHitBox.position);
        return {
            'x': pos.x + 5,
            'y': pos.y + 30,
            'width': this.relativeHitBox.width - 10,
            'height': this.relativeHitBox.height - 32,
        };
    }
    draw() {
        // let box = this.getHitBox();
        // this.__ctx.fillRect(box.x, box.y, box.width, box.height);

        if (this.exploded) { //raise up
            let frame = this.__frame;
            frame.draw(this.__ctx, this.position.x, this.position.y, this.width, this.height);
        } else {
            let frame = this.__animator.getCurrentFrame();
            frame.draw(this.__ctx, this.position.x, this.position.y, this.width, this.height);
        }
    }

}
