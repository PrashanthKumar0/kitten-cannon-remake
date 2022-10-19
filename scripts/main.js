// import { Vector2D } from "./Lib/Math/Vector2D.js";
import Sprite from "./Lib/Image/SpriteSheet.js";
import { $ } from "./utils.js";
import SpriteAnimator from "./Lib/Image/SpriteAnimator.js";
import { toRadians } from "./Lib/Math/functions.js";

//  production 
// console.log=()=>{};



let canvas, ctx;

async function main() {
    canvas = $("cnvs");
    canvas.width = 640;
    canvas.height = 480;
    ctx = canvas.getContext("2d");

    await preload();

    temp(); // just to test sprite Class temporrarily.
    gameLoop();
}

window.onload = main;



let sprite;
async function preload() {
    console.log("start loading");
    sprite = await new Sprite("assets/sprite_sheet/kitty_cannon_dat").load();
    console.log(sprite.name + " loaded...");
}

let venus_animation, spikes_animation;
let barrel_anim;
let grass_sprite, cannon_base;

function temp() {
    grass_sprite = sprite.getFrame("grass/1.png");
    cannon_base = sprite.getFrame("cannon_base/cannon_base.png");

    venus_animation = new SpriteAnimator("venus", sprite);
    spikes_animation = new SpriteAnimator("spikes", sprite);
    barrel_anim = new SpriteAnimator("barrel_shoot", sprite);

    venus_animation.onComplete = function () {
        console.log("completed venus animation");
        venus_animation.reset();
    }
    barrel_anim.onComplete = function () {
        console.log("completed spikes animation");
        barrel_anim.reset();
    }

}

function animate(obj_animation, x = 0, y = 0) {
    let animation_frame = obj_animation.getCurrentFrame();

    let w = animation_frame.getWidth();
    let h = animation_frame.getHeight();
    animation_frame.draw(ctx, x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    obj_animation.proceed();
}

let barrel_ang=toRadians(-60);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if(barrel_ang < toRadians(-10)) {
        barrel_ang+=0.01;
    }

    let grass_h = grass_sprite.getHeight();

    let cannon_base_w = cannon_base.getWidth();
    let cannon_base_h = cannon_base.getHeight();

    let y_bottom = canvas.height - grass_h;

    grass_sprite.draw(ctx, 0, canvas.height - grass_h + 1);
    animate(venus_animation, 520 ,y_bottom - 20);
    animate(spikes_animation, 260, y_bottom + 40);

    
    ctx.save();
    {
        let x=100;
        let y=canvas.height - cannon_base_h + 10;
        let bh=barrel_anim.getCurrentFrame().getHeight();
        ctx.translate(x, y + bh/2);
        ctx.rotate(barrel_ang);
        // ctx.fillRect(0, 0, 10, 10);
        animate(barrel_anim, 0,-bh/2);
    } ctx.restore();
   
    cannon_base.draw(ctx, 0, canvas.height - cannon_base_h - 10);

    setTimeout(gameLoop, 60);
    // requestAnimationFrame(gameLoop);
}
