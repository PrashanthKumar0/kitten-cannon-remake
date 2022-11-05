import { randomInt } from "../../Lib/Math/functions.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";
import bloodParticle from "./BloodParticle.js";

export default class Kitten {
    constructor(renderer, sprite_sheet, sound_manager) {
        this.__renderer = renderer;
        this.__sound_manager = sound_manager;
        this.__sprite_sheet = sprite_sheet;
        this.__frames_hq = [];
        let kitty_hq_anim_names = sprite_sheet.getAnimationFrames("kitty_hq");
        kitty_hq_anim_names.forEach((animName) => {
            this.__frames_hq.push(sprite_sheet.getFrame(animName));
        });

        this.minVelocityMagSq = 10 ** 2;
        this.boneBreakingVelocityMagSq = this.minVelocityMagSq;
        this.__frames_lq = [];
        let kitty_lq_anim_names = sprite_sheet.getAnimationFrames("kitty");
        kitty_lq_anim_names.forEach((animName) => {
            this.__frames_lq.push(sprite_sheet.getFrame(animName));
        });

        this.groundLevel = this.__renderer.canvas.height - 24;
        this.groundDampFactor = 0.7;

        this.position = new Vector2D(0, 0);
        this.velocity = new Vector2D(5, -5);
        this.gravity = new Vector2D(0, 0.6);
        let ar = this.__frames_hq[0].getWidth() / this.__frames_hq[0].getHeight();
        this.height = 86;
        this.width = ar * this.height;
        this.rotation = 0;
        this.spriteIndex = 0;
        this.in_jerk = false;
        this.isDead = false;
        this.visible = false;
        this.omega = 0.05;
        this.virtualPosXMax = this.__renderer.canvas.width - 300;
        this.bloodParticles = [];
    }

    throw(velocity) {
        this.rotation = velocity.getAngle();
        this.velocity = velocity;
        this.in_jerk = true;
    }
    update(dt) {

        if (!this.visible) return;
        this.in_jerk = false;
        if (this.isDead) {
            this.position.y = this.groundLevel - this.height;
            this.velocity = new Vector2D(0, 0);
            return;
        }
        this.position.add(this.velocity.copy().scale(dt));
        this.position.y = this.position.copy().add(this.velocity.copy().scale(dt)).y;

        this.velocity.add(this.gravity.copy().scale(dt));
        if (this.position.y + this.height > this.groundLevel) {
            this.position.y = this.groundLevel - this.height;
            let velMagSq = this.velocity.magSq();
            if (velMagSq <= this.minVelocityMagSq) {
                this.isDead = true;
                this.spawnBlood();
                return;
            }
            this.velocity.y *= -this.groundDampFactor;
            this.velocity.x *= this.groundDampFactor;
            if (velMagSq >= this.boneBreakingVelocityMagSq) {
                this.__sound_manager.play("hit" + randomInt(1, 4));
                this.spawnBlood();
                this.spriteIndex = Math.floor(Math.random() * this.__frames_hq.length);
            }
            if (velMagSq >= 15 ** 2) {
                this.in_jerk = true;
            }
            this.omega = this.velocity.x / 120;
        }
        this.rotation += this.omega * dt;
    }

    spawnBlood() {
        this.bloodParticles.push(new bloodParticle(this.__renderer, this.__sprite_sheet, this.position.copy().add(new Vector2D(0, this.height / 2))));
    }
    draw() {
        this.__draw_blood();
        if (!this.visible) return;
        this.__drawKitten();
    }
    __draw_blood() {
        this.__renderer.imageSmoothingEnabled = false;
        
        this.bloodParticles.forEach((blood) => {
            blood.draw();
        });

        this.__renderer.imageSmoothingEnabled = true;
    }
    __drawKitten() {
        let frame = this.__frames_hq[this.spriteIndex];
        if (this.in_jerk) frame = this.__frames_lq[this.spriteIndex];
        let x = this.position.x;
        let y = this.position.y;
        let w = this.width;
        let h = this.height;
        this.__renderer.drawCenteredFrame(frame, x, y, w, h, this.rotation);
    }
}