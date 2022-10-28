import SpriteAnimator from "../../Lib/Image/SpriteAnimator.js";
import { toRadians, toDegree } from "../../Lib/Math/functions.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";

export default class Cannon {
    constructor(canvas2D_context, sprite_sheet, sound_manager) {
        this.__sound_manager = sound_manager;
        this.__ctx = canvas2D_context;
        this.__sprite_sheet = sprite_sheet;
        this.__frames = {};
        this.__addCannonBaseFrame();
        this.__addCannonDialFrame();
        this.__addBarrelFrame();

        this.barrel_angleMax = toRadians(-10);
        this.barrel_angleMin = toRadians(-60);
        this.barrel_angle = this.barrel_angleMax;
        this.barrel_angle_unit = toRadians(0.5);

        this.minPowerPercent = 5;
        this.powerVelocityScale = 5;
        this.powerPercent = this.minPowerPercent;
        this.powerVelocity = this.powerVelocityScale;

        this.__animations = {};
        this.__addMeterAnimator();
        this.__addBarrelShootAnimator();
        this.isShooting = false;
        this.x = 0;
        this.y = 0;
        // this.virtualPosXMax = this.__ctx.canvas.width - 250;

    }

    __addMeterAnimator() {
        let meter_animator = new SpriteAnimator('cannon_meter', this.__sprite_sheet);
        meter_animator.loop = true;
        let x = 26;
        let y = this.__ctx.canvas.height - 281;
        let ar = meter_animator.getCurrentFrame().getAspectRatio();
        let h = 160;
        let w = h * ar;
        this.__animations['barrel_meter'] = {
            animator: meter_animator,
            x: x,
            y: y,
            w: w,
            h: h,
        }
    }

    __addBarrelShootAnimator() {
        let barrel = this.__frames.cannon_barrel;
        let meter_animator = new SpriteAnimator('barrel_shoot', this.__sprite_sheet);
        let x = barrel.x;
        let y = barrel.y;
        let h = barrel.h;
        let w = barrel.w;
        meter_animator.onComplete = (function () {
            // this.isShooting = false;
        }.bind(this));
        this.__animations['barrel_shoot'] = {
            animator: meter_animator,
            x: x,
            y: y,
            w: w,
            h: h,
        }
    }

    __addCannonBaseFrame() {
        let frame = this.__sprite_sheet.getFrame("cannon_base/cannon_base.png");
        let ar = frame.getAspectRatio();
        let h = 160;
        let w = h * ar;
        let x = 109;
        let y = this.__ctx.canvas.height - 188;



        this.__frames['cannon_base'] = {
            'frame': frame,
            'x': x,
            'y': y,
            'w': w,
            'h': h,
        };
    }

    __addCannonDialFrame() {
        let frame = this.__sprite_sheet.getFrame("cannon_dial/1.png");
        let x = 160;
        let y = this.__ctx.canvas.height - 176;
        let w = 30;
        let h = 30;

        this.__frames['cannon_dial'] = {
            'frame': frame,
            'x': x,
            'y': y,
            'w': w,
            'h': h,
        };
    }
    __addBarrelFrame() {
        let frame = this.__sprite_sheet.getFrame("barrel_shoot/1.png");
        let ar = frame.getAspectRatio();
        let h = 95;
        let w = h * ar;
        let x = 176;
        let y = this.__ctx.canvas.height - 194;


        this.__frames['cannon_barrel'] = {
            'frame': frame,
            'x': x,
            'y': y,
            'w': w,
            'h': h,
        };
    }


    draw() {
        this.__ctx.save();
        this.__ctx.translate(this.x, 0);
        if (this.isShooting) {
            this.draw_barrelShootAnimation();
        } else {
            this.draw_barrel();
        }
        this.draw_powerPercentage();
        this.draw_meter();
        this.draw_cannonBase();
        this.draw_cannonDial();
        this.draw_barrelAngleText();
        this.__ctx.restore();

    }
    draw_cannonBase() {
        let cannon_base = this.__frames.cannon_base;
        cannon_base.frame.draw(this.__ctx, cannon_base.x, cannon_base.y, cannon_base.w, cannon_base.h);
    }
    draw_cannonDial() {
        let cannon_dial = this.__frames.cannon_dial;
        this.__ctx.save();

        this.__ctx.translate(cannon_dial.x + cannon_dial.w / 2, cannon_dial.y + cannon_dial.h / 2);

        this.__ctx.rotate(-this.barrel_angle);

        cannon_dial.frame.draw(this.__ctx, -cannon_dial.w / 2, -cannon_dial.h / 2, cannon_dial.w, cannon_dial.h)
        this.__ctx.restore();
    }
    draw_powerPercentage() {
        let max_w = 84;
        let x = 120;
        let y = this.__ctx.canvas.height - 134;
        let w = (this.powerPercent / 100) * max_w;
        let h = 18;
        //grey bg
        this.__ctx.fillStyle = "#333333";
        this.__ctx.fillRect(x, y, max_w, h);
        // fg bar
        this.__ctx.fillStyle = "#990000";
        this.__ctx.fillRect(x, y, w, h);
    }
    draw_barrelAngleText() {
        this.__ctx.textBaseline = "top";
        this.__ctx.font = "15px Arial";
        this.__ctx.fillStyle = "#fdfd97";
        let x = 150;
        let y = this.__ctx.canvas.height - 130;
        let txt = (toDegree(Math.abs(this.barrel_angle))).toFixed(1);
        this.__ctx.fillText(txt, x, y);
    }
    draw_barrel() {
        let cannon_barrel = this.__frames.cannon_barrel;
        this.__ctx.save();
        this.__ctx.translate(cannon_barrel.x, cannon_barrel.y + cannon_barrel.h / 2);
        this.__ctx.rotate(this.barrel_angle);
        // this.__ctx.fillRect(0, 0, 10, 10);
        // this.__ctx.strokeRect(0, -cannon_barrel.h / 2, cannon_barrel.w, cannon_barrel.h)
        cannon_barrel.frame.draw(this.__ctx, 0, -cannon_barrel.h / 2, cannon_barrel.w, cannon_barrel.h)
        this.__ctx.restore();
    }
    draw_meter() {
        let meter_frame = this.__animations.barrel_meter.animator.getCurrentFrame();
        let x = this.__animations.barrel_meter.x;
        let y = this.__animations.barrel_meter.y;
        let w = this.__animations.barrel_meter.w;
        let h = this.__animations.barrel_meter.h;
        // this.__ctx.strokeRect(x, y, w, h);
        this.__ctx.imageSmoothingEnabled = false;
        meter_frame.draw(this.__ctx, x, y, w, h);
        this.__ctx.imageSmoothingEnabled = true;
    }

    draw_barrelShootAnimation() {
        let barrel_shoot_frame = this.__animations.barrel_shoot.animator.getCurrentFrame();

        let cannon_barrel = this.__frames.cannon_barrel;
        this.__ctx.save();
        this.__ctx.translate(cannon_barrel.x, cannon_barrel.y + cannon_barrel.h / 2);
        this.__ctx.rotate(this.barrel_angle);
        this.__ctx.fillRect(0, 0, 10, 10);
        // this.__ctx.strokeRect(0, -cannon_barrel.h / 2, cannon_barrel.w, cannon_barrel.h)
        barrel_shoot_frame.draw(this.__ctx, 0, -cannon_barrel.h / 2, cannon_barrel.w, cannon_barrel.h)
        this.__ctx.restore();
        // barrel_frame.draw(this.__ctx, 0, 0, 100, 100);
    }

    barrelUp() {
        if (this.isShooting) return;
        this.barrel_angle -= this.barrel_angle_unit;
        if (this.barrel_angle <= this.barrel_angleMin) this.barrel_angle = this.barrel_angleMin;
        else {
            this.__sound_manager.play("barrel");
        }
    }

    barrelDown() {
        if (this.isShooting) return;
        this.barrel_angle += this.barrel_angle_unit;
        if (this.barrel_angle >= this.barrel_angleMax) this.barrel_angle = this.barrel_angleMax;
        else {
            this.__sound_manager.play("barrel");
        }
    }

    barrelShoot() {
        this.isShooting = true;
    }


    resetBarrel() {
        this.isShooting = false;
        this.barrel_angle = this.barrel_angleMax;
    }

    getBarrelDirectionVector() {
        return new Vector2D().fromAngle(this.barrel_angle);

    }
    getBarrelEnd() {
        let barrel_frame = this.__frames.cannon_barrel;
        let base_vec = this.getBarrelStart();
        let fireWidth = (barrel_frame.w) * (22 / 100); // since barrel sprite contains padding for fire.
        return base_vec.add(this.getBarrelDirectionVector().scale(barrel_frame.w - fireWidth));
    }

    getBarrelStart() {
        let barrel_frame = this.__frames.cannon_barrel;
        return new Vector2D(barrel_frame.x, barrel_frame.y + barrel_frame.h / 2);
    }

    update() {
        this.__animations.barrel_meter.animator.proceed();
        if (this.isShooting) {
            this.__animations.barrel_shoot.animator.proceed();
        } else {

            this.update_powerPercentage();
        }
    }
    // resetCannon() {
    //     this.isShooting = false;
    //     this.__animations.barrel_shoot.animator.reset();
    // }
    update_powerPercentage() {
        this.powerPercent += this.powerVelocity;
        if (this.powerPercent >= 100) {
            this.powerPercent = 100;
            this.powerVelocity = -this.powerVelocityScale * 1.5;
        }
        if (this.powerPercent <= this.minPowerPercent) {
            this.powerPercent = this.minPowerPercent;
            this.powerVelocity = this.powerVelocityScale;
        }
    }
}
