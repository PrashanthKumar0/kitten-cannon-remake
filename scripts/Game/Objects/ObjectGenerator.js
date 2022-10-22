import { checkRectRectCollision, randomInt } from "../../Lib/Math/functions.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
import Bomb from "./Bomb.js";
import Spike from "./Spike.js";
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
        });
    }
    update() {
        if (this.objects.length < this.max_objects) {
            this.objects.push(this.generateNewObject());
        }
        this.objects.forEach((object, idx) => {
            if (!(this.kitty.isDead || !this.kitty.visible)) {
                object.position.x -= this.kitty.velocity.x;
            }
            object.update();
            if (
                checkRectRectCollision(
                    object.getHitBox(),
                    {
                        'x': this.kitty.position.x,
                        'y': this.kitty.position.y,
                        'width': this.kitty.width,
                        'height': this.kitty.height,
                    }
                )
            ) {
                this.kitty.visible = false;
                this.kitty.isDead = true;
                object.shouldAnimate = true;

                if (object instanceof Spike) {
                    this.kitty.visible = true;
                    if (this.kitty.position.y < this.kitty.groundLevel) {
                        this.kitty.position.y += 1;
                    }
                }

                if (object instanceof Bomb) {
                    this.kitty.isDead = false;
                    this.kitty.visible = true;
                    this.kitty.velocity.add(new Vector2D(50,100));
                    this.kitty.update();
                }
            }



            if (object.position.x + object.width < 0) {
                this.objects.splice(idx, 1);
            }
        });
    }
    generateNewObject() {
        let rand = randomInt(0, 2);
        switch (rand) {
            case 0: // VENUS
                {
                    let pos = new Vector2D(this.__ctx.canvas.width + this.gap_inbetween, this.__ctx.canvas.height - 250)
                    if (this.objects.length == 0) {
                        return new Venus(this.__ctx, this.__sprite_sheet, pos);
                    }
                    pos.x = this.objects[this.objects.length - 1].position.x + this.gap_inbetween;
                    return new Venus(this.__ctx, this.__sprite_sheet, pos);
                }
            case 1: // Spike
                {
                    let pos = new Vector2D(this.__ctx.canvas.width + this.gap_inbetween, this.__ctx.canvas.height - 170)
                    if (this.objects.length == 0) {
                        return new Spike(this.__ctx, this.__sprite_sheet, pos);
                    }
                    pos.x = this.objects[this.objects.length - 1].position.x + this.gap_inbetween;
                    return new Spike(this.__ctx, this.__sprite_sheet, pos);
                }
            case 2: // Bomb
                {
                    let pos = new Vector2D(this.__ctx.canvas.width + this.gap_inbetween, this.__ctx.canvas.height - 200)
                    if (this.objects.length == 0) {
                        return new Bomb(this.__ctx, this.__sprite_sheet, pos);
                    }
                    pos.x = this.objects[this.objects.length - 1].position.x + this.gap_inbetween;
                    return new Bomb(this.__ctx, this.__sprite_sheet, pos);
                }

        }
    }
}