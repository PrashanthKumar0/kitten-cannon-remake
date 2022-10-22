import { checkRectRectCollision } from "../../Lib/Math/functions.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
import Venus from "./Venus.js";

export default class ObjectGenerator {
    constructor(canvas2D_context, sprite_sheet, kitty, gap_inbetween) {
        this.__ctx = canvas2D_context;
        this.__sprite_sheet = sprite_sheet;
        this.gap_inbetween = gap_inbetween;
        this.kitty = kitty;
        this.objects = [];
        this.max_objects = 4;
    }
    drawAll() {
        this.objects.forEach((object) => {
            object.draw();
            // debugger;
        });
    }
    update() {
        if (this.objects.length < this.max_objects) {
            this.objects.push(this.generateNewObject());
        }
        this.objects.forEach((object, idx) => {
            if (!this.kitty.isDead) {
                object.position.x -= this.kitty.velocity.x;
            }
            object.update();

            if (
                checkRectRectCollision(
                    {
                        'x': object.position.x,
                        'y': object.position.y,
                        'width': object.width,
                        'height': object.height,
                    },
                    {
                        'x': this.kitty.position.x,
                        'y': this.kitty.position.y,
                        'width': this.kitty.width,
                        'height': this.kitty.height,
                    }
                )
            ) {
                this.kitty.isDead = true;
                this.kitty.visible = false;
                object.shouldAnimate = true;
            }



            if (object.position.x + object.width < 0) {
                this.objects.splice(idx, 1);
            }
        });
    }
    generateNewObject() {
        let prevPos;
        if (this.objects.length == 0) {
            let pos = new Vector2D(this.__ctx.canvas.width + this.gap_inbetween, this.__ctx.canvas.height - 250);
            return new Venus(this.__ctx, this.__sprite_sheet, pos);
        } else {
            prevPos = this.objects[this.objects.length - 1].position.copy();
        }
        return new Venus(this.__ctx, this.__sprite_sheet, prevPos.add(new Vector2D(this.gap_inbetween, 0)));
    }
}