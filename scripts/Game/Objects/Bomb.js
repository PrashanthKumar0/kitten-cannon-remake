import SpriteAnimator from "../../Lib/Image/SpriteAnimator.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
import GameObject from "./GameObject.js";

export default class Bomb extends GameObject{
    constructor(renderer, sprite_sheet, position) {
        let height = 160;
        super(renderer, sprite_sheet, position, height, "tnt");

        this.__tnt_animator = new SpriteAnimator("tnt", this.__sprite_sheet);
        this.__blast_animator = new SpriteAnimator("tnt_blast", this.__sprite_sheet);
        this.relativeHitBox = {
            'position': new Vector2D(this.width / 4, this.height / 2),
            'width': this.width / 2,
            'height': this.height / 2,
        };
    }
    update() {
        if (this.shouldAnimate) {
            this.__tnt_animator.proceed();
            this.__blast_animator.proceed();
        }
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
