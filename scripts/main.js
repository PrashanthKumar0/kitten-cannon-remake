// import { Vector2D } from "./Lib/Math/Vector2D.js";
import Sprite from "./Lib/Image/SpriteSheet.js";
import { $ } from "./utils.js";
// import SpriteAnimator from "./Lib/Image/SpriteAnimator.js";
// import { toRadians } from "./Lib/Math/functions.js";
import Grass from "./Game/Objects/Grass.js";
import Cannon from "./Game/Objects/Cannon.js";
import { KEYS, handleKeyboardCallbacks, registerKeyEventCallback } from "./Game/KeyboardController.js";
//  production 
// console.log=()=>{};



let canvas, ctx;

async function main() {
    setup();
    await preload();

    gameLoop();
}

window.onload = main;

function setup() {
    canvas = $("cnvs");
    canvas.width = 1040;
    canvas.height = 640;
    ctx = canvas.getContext("2d");
}

let sprite;
let grass, cannon;
async function preload() {
    console.log("start loading");
    sprite = await new Sprite("assets/sprite_sheet/kitty_cannon_dat").load();
    console.log(sprite.name + " loaded...");
    grass = new Grass(ctx, sprite);
    cannon = new Cannon(ctx, sprite);


    KEYS.r="r";
    registerKeyEventCallback(KEYS.r, () => { cannon.resetCannon(); }); // temporarry
    
    registerKeyEventCallback(KEYS.w, () => { cannon.barrelUp(); });
    registerKeyEventCallback(KEYS.arrowup, () => { cannon.barrelUp(); });
    registerKeyEventCallback(KEYS.s, () => { cannon.barrelDown(); });
    registerKeyEventCallback(KEYS.arrowdown, () => { cannon.barrelDown(); });
    registerKeyEventCallback(KEYS.space, () => { cannon.barrelShoot(); });

}


let bg = new Image();
bg.src = "ref_images/cannon_60deg.png";

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(bg, 0, 0);

    grass.draw();
    cannon.draw();
    cannon.update();
    handleKeyboardCallbacks();

    // setTimeout(gameLoop, 1000 / 60);
    requestAnimationFrame(gameLoop);
}
