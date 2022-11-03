import { randomInt } from "../../Lib/Math/functions.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
import GameObject from "./GameObject.js";

export default class Balloon extends GameObject {
    constructor(renderer, sprite_sheet, position) {
        let height = 180;
        super(renderer, sprite_sheet, position, height, "baloon_blast");

        let frame_names = sprite_sheet.getAnimationFrames("baloon");
        this.frameIndex = randomInt(0, frame_names.length - 1);

        this.__frame = this.__sprite_sheet.getFrame(frame_names[this.frameIndex]);

        this.vely = 10;
        this.exploded = false;
        this.__animator.onComplete = () => {
            this.exploded = true;
        };

        this.relativeHitBox = {
            'position': new Vector2D(this.width / 4, this.height / 2),
            'width': this.width / 2,
            'height': this.height / 2,
        };
    }
    update() {
        super.update();
        if (this.exploded) {
            let frame = this.__animator.getCurrentFrame();
            let ar = frame.getWidth() / frame.getHeight();
            this.height = 92;
            this.width = this.height * ar;

            this.position.y -= this.vely;
        }
    }
    draw() {
        // let box = this.getHitBox();
        // this.__ctx.fillRect(box.x, box.y, box.width, box.height);

        if (this.exploded) { //raise up
            let frame = this.__frame;
            this.__renderer.drawFrame(frame, this.position.x, this.position.y, this.width, this.height);
        } else {
            let frame = this.__animator.getCurrentFrame();
            this.__renderer.drawFrame(frame, this.position.x, this.position.y, this.width, this.height);
        }
    }
}
