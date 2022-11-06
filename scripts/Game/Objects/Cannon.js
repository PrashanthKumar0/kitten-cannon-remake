import SpriteAnimator from "../../Lib/Image/SpriteAnimator.js";
import { toRadians, toDegree } from "../../Lib/Math/functions.js";
import { Vector2D } from "../../Lib/Math/Vector2D.js";

export default class Cannon {
    constructor(renderer, sprite_sheet, sound_manager) {
        this.__sound_manager = sound_manager;
        this.__renderer = renderer;
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
        this.powerVelocityScale = 4;
        this.powerPercent = this.minPowerPercent;
        this.powerVelocity = this.powerVelocityScale;

        this.__animations = {};
        this.__addMeterAnimator();
        this.__addBarrelShootAnimator();
        this.isShooting = false;
        this.x = 0;
        this.y = 0;
    }

    __addMeterAnimator() {
        let meter_animator = new SpriteAnimator('cannon_meter', this.__sprite_sheet);
        meter_animator.loop = true;
        let x = 26;
        let y = this.__renderer.camera.getHeight() - 281;
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
        let y = this.__renderer.camera.getHeight() - 188;

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
        let y = this.__renderer.camera.getHeight() - 176;
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
        let y = this.__renderer.camera.getHeight() - 194;

        this.__frames['cannon_barrel'] = {
            'frame': frame,
            'x': x,
            'y': y,
            'w': w,
            'h': h,
        };
    }

    draw() {
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
        return;
    }
    draw_cannonBase() {
        let cannon_base = this.__frames.cannon_base;
        this.__renderer.drawFrame(cannon_base.frame, cannon_base.x, cannon_base.y, cannon_base.w, cannon_base.h);
    }
    draw_cannonDial() {
        let cannon_dial = this.__frames.cannon_dial;
        this.__renderer.drawCenteredFrame(cannon_dial.frame, cannon_dial.x, cannon_dial.y, cannon_dial.w, cannon_dial.h, -this.barrel_angle);
    }
    draw_powerPercentage() {
        let max_w = 84;
        let x = 120;
        let y = this.__renderer.camera.getHeight() - 134;
        let w = (this.powerPercent / 100) * max_w;
        let h = 18;
        //grey bg
        this.__renderer.drawSolidRect(x, y, max_w, h, "#333333");

        // fg bar
        this.__renderer.drawSolidRect(x, y, w, h, "#990000");
    }
    draw_barrelAngleText() {
        let x = 150;
        let y = this.__renderer.camera.getHeight() - 130;
        let txt = (toDegree(Math.abs(this.barrel_angle))).toFixed(1);

        this.__renderer.drawSolidText(txt, x, y, "#fdfd97", 15, "Arial", "top");

    }
    draw_barrel() {
        let cannon_barrel = this.__frames.cannon_barrel;
        let pivot_pioint = new Vector2D(0, cannon_barrel.h / 2)
        this.__renderer.drawPivotedFrame(cannon_barrel.frame, cannon_barrel.x, cannon_barrel.y, cannon_barrel.w, cannon_barrel.h, pivot_pioint, this.barrel_angle);
    }
    draw_meter() {
        let meter_frame = this.__animations.barrel_meter.animator.getCurrentFrame();
        let x = this.__animations.barrel_meter.x;
        let y = this.__animations.barrel_meter.y;
        let w = this.__animations.barrel_meter.w;
        let h = this.__animations.barrel_meter.h;
        // this.__ctx.strokeRect(x, y, w, h);

        this.__renderer.imageSmoothingEnabled = false;
        this.__renderer.drawFrame(meter_frame, x, y, w, h);
        this.__renderer.imageSmoothingEnabled = true;
    }

    draw_barrelShootAnimation() {
        let barrel_shoot_frame = this.__animations.barrel_shoot.animator.getCurrentFrame();

        let cannon_barrel = this.__frames.cannon_barrel;
        let pivot_pioint = new Vector2D(0, cannon_barrel.h / 2);
        this.__renderer.drawPivotedFrame(barrel_shoot_frame, cannon_barrel.x, cannon_barrel.y, cannon_barrel.w, cannon_barrel.h, pivot_pioint, this.barrel_angle)
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
        this.__animations['barrel_shoot'].animator.reset();
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

    update(dt) {
        this.__animations.barrel_meter.animator.proceed();
        if (this.isShooting) {
            this.__animations.barrel_shoot.animator.proceed();
        } else {

            this.update_powerPercentage(dt);
        }
    }
    update_powerPercentage(dt) {
        this.powerPercent += this.powerVelocity * dt;
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
