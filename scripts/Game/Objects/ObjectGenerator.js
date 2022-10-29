import { checkRectRectCollision, randomInt } from "../../Lib/Math/functions.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
import Balloon from "./Balloon.js";
import Blast from "./Blast.js";
import Bomb from "./Bomb.js";
import Spike from "./Spike.js";
import Trampoline from "./Trampoline.js";
import Venus from "./Venus.js";

export default class ObjectGenerator {
    constructor(canvas2D_context, sprite_sheet, kitty, gap_inbetween, sound_manager) {
        this.__sound_manager = sound_manager;
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
    update(dt) {
        if (this.objects.length < this.max_objects) {
            this.objects.push(this.generateNewObject());
        }
        this.objects.forEach((object, idx) => {
            if (!(this.kitty.isDead || !this.kitty.visible)) {
                object.position.x -= this.kitty.velocity.x * dt;
            }
            object.update(dt);
            let hitBox;
            if (object.getHitBox) {
                hitBox = object.getHitBox();
            } else {
                hitBox = { x: 0, y: 0, width: 0, height: 0 };
            }
            if (
                checkRectRectCollision(
                    hitBox,
                    {
                        'x': this.kitty.position.x,
                        'y': this.kitty.position.y,
                        'width': this.kitty.width,
                        'height': this.kitty.height,
                    }
                )
            ) {
                object.shouldAnimate = true;
                if (object instanceof Venus) {
                    if (this.kitty.isDead) return;
                    this.__sound_manager.play("swallow");
                    this.kitty.visible = false;
                    this.kitty.isDead = true;
                }

                if (object instanceof Spike) {
                    if (this.kitty.isDead) return;
                    this.__sound_manager.play("spike");
                    this.kitty.visible = true;
                    if (this.kitty.position.y < this.kitty.groundLevel) {
                        this.kitty.position.y += 0.1;
                    }
                    this.kitty.isDead = true;
                }

                if (object instanceof Trampoline) {
                    this.__sound_manager.play("trampoline");
                    this.kitty.velocity.scale(1.4);
                    this.kitty.velocity.y *= -1;
                    // let box = object.getHitBox();
                    // this.kitty.position = new Vector2D(box.x + box.width + this.kitty.width + 3, box.y - this.kitty.height - 3);
                    let itr = 0;
                    while (checkRectRectCollision(
                        object.getHitBox(),
                        {
                            'x': this.kitty.position.x,
                            'y': this.kitty.position.y,
                            'width': this.kitty.width,
                            'height': this.kitty.height,
                        }
                    )) {
                        itr++;
                        if (itr > 30) break;
                        this.kitty.update(dt);
                    }
                }
                if (object instanceof Bomb) {
                    this.__sound_manager.play("tnt_blast");

                    this.kitty.velocity.add(new Vector2D(38, -76));
                    this.kitty.update(dt);
                    this.objects.push(new Blast(this.__ctx, this.__sprite_sheet, new Vector2D(hitBox.x, hitBox.y)));
                }

                if ((object instanceof Balloon)) {
                    this.__sound_manager.play("baloon_blast");
                    if (!object.exploded) {
                        this.kitty.update(dt);
                        this.kitty.velocity.add(new Vector2D(20, -40));
                    }
                    this.objects.push(new Blast(this.__ctx, this.__sprite_sheet, new Vector2D(hitBox.x, hitBox.y)));
                }
            }



            if (object.position.x + object.width < 0) {
                this.objects.splice(idx, 1);
            }
        });
    }
    generateNewObject() {
        let rand = randomInt(0, 4);
        // rand = 2;
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
            case 3: // Trampoline
                {
                    let pos = new Vector2D(this.__ctx.canvas.width + this.gap_inbetween, this.__ctx.canvas.height - 136)
                    if (this.objects.length == 0) {
                        return new Trampoline(this.__ctx, this.__sprite_sheet, pos);
                    }
                    pos.x = this.objects[this.objects.length - 1].position.x + this.gap_inbetween;
                    return new Trampoline(this.__ctx, this.__sprite_sheet, pos);
                }

            case 4: // Baloon
                {
                    let pos = new Vector2D(this.__ctx.canvas.width + this.gap_inbetween, this.__ctx.canvas.height - 400)
                    if (this.objects.length == 0) {
                        return new Balloon(this.__ctx, this.__sprite_sheet, pos);
                    }
                    pos.x = this.objects[this.objects.length - 1].position.x + this.gap_inbetween;
                    return new Balloon(this.__ctx, this.__sprite_sheet, pos);
                }
        }
    }
}