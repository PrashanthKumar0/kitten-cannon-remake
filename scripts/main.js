import { Vector2D } from "./Lib/Math/Vector2D.js";
import Sprite from "./Lib/Image/SpriteSheet.js";
import { $ } from "./utils.js";
// import SpriteAnimator from "./Lib/Image/SpriteAnimator.js";
// import { toRadians } from "./Lib/Math/functions.js";
import Grass from "./Game/Objects/Grass.js";
import Cannon from "./Game/Objects/Cannon.js";
import { KEYS, handleKeyboardCallbacks, registerKeyEventCallback } from "./Game/KeyboardController.js";
import Kitten from "./Game/Objects/Kitten.js";
import ObjectGenerator from "./Game/Objects/ObjectGenerator.js";
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
let ground_ref;
let kitty;
const OBJECT_GAP = 600;
let objectGenerator;
async function preload() {
    console.log("start loading");
    sprite = await new Sprite("assets/sprite_sheet/kitty_cannon_dat").load();
    console.log(sprite.name + " loaded...");
    grass = new Grass(ctx, sprite);
    cannon = new Cannon(ctx, sprite);
    kitty = new Kitten(ctx, sprite);
    objectGenerator = new ObjectGenerator(ctx, sprite, kitty, OBJECT_GAP);
    ground_ref = canvas.height - 60;

    KEYS.r = "r";
    registerKeyEventCallback(KEYS.r, () => { cannon.resetCannon(); }); // temporarry

    registerKeyEventCallback(KEYS.w, () => { cannon.barrelUp(); });
    registerKeyEventCallback(KEYS.arrowup, () => { cannon.barrelUp(); });
    registerKeyEventCallback(KEYS.s, () => { cannon.barrelDown(); });
    registerKeyEventCallback(KEYS.arrowdown, () => { cannon.barrelDown(); });
    registerKeyEventCallback(KEYS.space, () => {
        if (!kitty.visible) {
            cannon.barrelShoot();
            let barrelDir = cannon.getBarrelDirectionVector();
            kitty.visible = true;
            kitty.position = cannon.getBarrelEnd()
                .subtract(barrelDir.copy().scale(32))
                .subtract(new Vector2D(kitty.width / 2, kitty.height / 2));
            kitty.throw(barrelDir.scale((cannon.powerPercent / 100) * 80));
        }
    });

}


let bg = new Image();
bg.src = "ref_images/game_over.png";

function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(bg, 0, 0);
    grass.draw();
    cannon.draw();
    kitty.draw();
    kitty.update();
    if (kitty.visible && !kitty.isDead) {
        grass.x -= kitty.velocity.x;
        cannon.x -= kitty.velocity.x;
        kitty.update_blood_particles(kitty.velocity.x); // these interfaces are bad for now
        // objectGenerator.update(kitty.velocity.x);
    }
    objectGenerator.update();


    objectGenerator.drawAll();
    cannon.update();

    handleKeyboardCallbacks();

    // setTimeout(gameLoop, 1000 / 60);
    requestAnimationFrame(gameLoop);
}
