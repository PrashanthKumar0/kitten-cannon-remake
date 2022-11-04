import { checkRectRectCollision, randomInt } from "../../Lib/Math/functions.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
import Timer from "../Timer.js";
import Balloon from "./Balloon.js";
import Blast from "./Blast.js";
import Bomb from "./Bomb.js";
import Spike from "./Spike.js";
import Trampoline from "./Trampoline.js";
import Venus from "./Venus.js";

export default class ObjectGenerator {
    constructor(renderer, sprite_sheet, kitty, gap_inbetween, sound_manager) {
        this.__sound_manager = sound_manager;
        this.__renderer = renderer;
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
    resolve_collision_with(object) {
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
            console.log(" resolving ");
            itr++;
            if (itr >= 30) break;
            this.kitty.update(0.1);
        }
    }
    update(dt) {
        if (this.objects.length < this.max_objects) {
            this.objects.push(this.generateNewObject());
        }
        this.objects.forEach((object, idx) => {

            // object.update(dt);
            object.update();

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
                        this.kitty.gravity = this.kitty.velocity = new Vector2D(0, 0);
                        this.kitty.position.y += 5;
                        this.kitty.omega = 0;
                    } else {
                        this.kitty.isDead = true;
                    }
                }

                if (object instanceof Trampoline) {
                    this.__sound_manager.play("trampoline");
                    this.kitty.velocity.y *= -1;
                    let speed = this.kitty.velocity.mag();
                    this.kitty.velocity.y *= 3;
                    this.kitty.velocity.normalize().scale(speed);
                    if (this.kitty.velocity.x < 2)
                        this.kitty.velocity.x = 2; // prevent jumping on same trampoline

                    object.onAnimationComplete = () => {
                        object.reset();
                    };

                    this.resolve_collision_with(object);
                }
                if (object instanceof Bomb) {
                    this.__sound_manager.play("tnt_blast");
                    this.kitty.velocity.y *= -2;
                    this.kitty.velocity.x *= 1.8;
                    this.kitty.velocity.x += 10;
                    this.kitty.velocity.y -= 10;

                    this.kitty.update(dt);
                    this.objects.push(new Blast(this.__renderer, this.__sprite_sheet, new Vector2D(hitBox.x, hitBox.y)));
                    this.resolve_collision_with(object);
                }

                if ((object instanceof Balloon)) {
                    this.__sound_manager.play("baloon_blast");
                    if (!object.exploded) {
                        this.kitty.update(dt);
                        this.kitty.velocity.add(new Vector2D(20, -40));
                    }
                    this.objects.push(new Blast(this.__renderer, this.__sprite_sheet, new Vector2D(hitBox.x, hitBox.y)));
                }
            }



            if (object.position.x + object.width < this.__renderer.camera.position.x) {
                this.objects.splice(idx, 1);
            }
        });
    }
    generateNewObject() {
        let rand = randomInt(0, 4);
        switch (rand) {
            case 0: // VENUS
                {
                    let pos = new Vector2D(this.__renderer.camera.getWidth() + this.gap_inbetween, this.__renderer.camera.getHeight() - 250)
                    if (this.objects.length == 0) {
                        return new Venus(this.__renderer, this.__sprite_sheet, pos);
                    }
                    pos.x = this.objects[this.objects.length - 1].position.x + this.gap_inbetween;
                    return new Venus(this.__renderer, this.__sprite_sheet, pos);
                }
            case 1: // Spike
                {
                    let pos = new Vector2D(this.__renderer.camera.getWidth() + this.gap_inbetween, this.__renderer.camera.getHeight() - 170)
                    if (this.objects.length == 0) {
                        return new Spike(this.__renderer, this.__sprite_sheet, pos);
                    }
                    pos.x = this.objects[this.objects.length - 1].position.x + this.gap_inbetween;
                    return new Spike(this.__renderer, this.__sprite_sheet, pos);
                }
            case 2: // Bomb
                {
                    let pos = new Vector2D(this.__renderer.camera.getWidth() + this.gap_inbetween, this.__renderer.camera.getHeight() - 200)
                    if (this.objects.length == 0) {
                        return new Bomb(this.__renderer, this.__sprite_sheet, pos);
                    }
                    pos.x = this.objects[this.objects.length - 1].position.x + this.gap_inbetween;
                    return new Bomb(this.__renderer, this.__sprite_sheet, pos);
                }
            case 3: // Trampoline
                {
                    let pos = new Vector2D(this.__renderer.camera.getWidth() + this.gap_inbetween, this.__renderer.camera.getHeight() - 136)
                    if (this.objects.length == 0) {
                        return new Trampoline(this.__renderer, this.__sprite_sheet, pos);
                    }
                    pos.x = this.objects[this.objects.length - 1].position.x + this.gap_inbetween;
                    return new Trampoline(this.__renderer, this.__sprite_sheet, pos);
                }
            case 4: // Baloon
                {
                    let pos = new Vector2D(this.__renderer.camera.getWidth() + this.gap_inbetween, this.__renderer.camera.getHeight() - 400)
                    if (this.objects.length == 0) {
                        return new Balloon(this.__renderer, this.__sprite_sheet, pos);
                    }
                    pos.x = this.objects[this.objects.length - 1].position.x + this.gap_inbetween;
                    return new Balloon(this.__renderer, this.__sprite_sheet, pos);
                }
            default:
                throw Error(rand + " is not handled");
        }
    }
}