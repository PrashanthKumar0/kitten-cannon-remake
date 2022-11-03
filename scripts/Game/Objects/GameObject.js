import SpriteAnimator from "../../Lib/Image/SpriteAnimator.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";

export default class GameObject {
    constructor(renderer, sprite_sheet, position, height, animationName) {
        this.__renderer = renderer;
        this.__sprite_sheet = sprite_sheet;
        this.position = position;
        this.__animator = new SpriteAnimator(animationName, this.__sprite_sheet);
        this.shouldAnimate = false;
        let frame = this.__animator.getCurrentFrame();
        let ar = frame.getWidth() / frame.getHeight();
        this.height = height;
        this.width = this.height * ar;
        this.relativeHitBox = {
            'position': new Vector2D(0, 0),
            'width': 0,
            'height': 0,
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
        this.__renderer.drawFrame(frame, this.position.x, this.position.y, this.width, this.height);
    }

}