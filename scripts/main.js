import Sprite from "./Sprite/Sprite.js";
import { $ } from "./utils.js";





let canvas, ctx;

async function main() {
    canvas = $("cnvs");
    canvas.width = 640;
    canvas.height = 480;
    ctx = canvas.getContext("2d");

    await preload();
    gameLoop();
}

window.onload = main;




async function preload() {
    console.log("start loading");
    let sprite = await new Sprite("../assets/sprite_sheet/kitty_cannon_dat").load();
    console.log(sprite.name + " loaded...");
}

function gameLoop() {

    console.log("gameLoop()...");
    // settimeout(gameLoop,300);
    // requestAnimationFrame(gameLoop);
}
