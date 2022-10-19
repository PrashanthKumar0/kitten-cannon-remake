import SpriteAnimator from "../Lib/Image/SpriteAnimator.js";
import { linear_map, toRadians } from "../Lib/Math/functions.js";

export default class Tank {
    constructor(canvas2D_context, sprite_sheet) {
        this.__ctx = canvas2D_context;
        this.__sprite_sheet = sprite_sheet;

        this.__frames = {
        };
        this.__addCannonBaseFrame();
        this.__addCannonDialFrame();

        this.barrel_angleMax=toRadians(-10);
        this.barrel_angleMin=toRadians(-60);
        this.barrel_angle=this.barrel_angleMax;


        this.__animations = {
            'cannon_meter': new SpriteAnimator('cannon_meter', sprite_sheet),
            'barrel_shoot': new SpriteAnimator('barrel_shoot', sprite_sheet),
        };
        this.__animations.cannon_meter.loop = true;
        this.__animations.barrel_shoot.loop = true;
    }

    __addCannonBaseFrame() {
        let frame = this.__sprite_sheet.getFrame("cannon_base/cannon_base.png");
        let ar = frame.getAspectRatio();
        let h = 160;
        let w = h * ar;
        let x = 109;
        let y = this.__ctx.canvas.height - 188;

        this.barrel_angle = toRadians(10);

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
        let y = this.__ctx.canvas.height-180;
        let w = 35;
        let h = 35;

        this.__frames['cannon_dial'] = {
            'frame': frame,
            'x': x,
            'y': y,
            'w': w,
            'h': h,
        };
    }

    draw() {
        this.draw_cannonBase();
        this.draw_cannonDial();
    }
    draw_cannonBase() {
        let cannon_base = this.__frames.cannon_base;
        cannon_base.frame.draw(this.__ctx, cannon_base.x, cannon_base.y, cannon_base.w, cannon_base.h);
    }
    draw_cannonDial() {
        let cannon_dial = this.__frames.cannon_dial;
        this.__ctx.save();

        this.__ctx.translate(cannon_dial.x + cannon_dial.w/2, cannon_dial.y + cannon_dial.h/2);
        
        this.__ctx.rotate(linear_map(
            this.barrel_angle,
            this.barrel_angleMin,
            this.barrel_angleMax,
            0,
            Math.PI * 2
        ));
        
        cannon_dial.frame.draw(this.__ctx,-cannon_dial.w/2,-cannon_dial.h/2,cannon_dial.w,cannon_dial.h)
        

        this.__ctx.restore();
    }
    update() {
        for (let animKey in this.__animations) {
            this.__animations[animKey].proceed();
        }

    }
}
