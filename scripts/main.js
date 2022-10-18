import { Vector2D } from "./Lib/Math/Vector2D.js";
import Sprite from "./Lib/Image/SpriteSheet.js";
import { $ } from "./utils.js";





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

let baloon_frame;    
function temp(){
    // baloon_frame = sprite.getFrame('kitty_hq/3.png'); // instance of Sprite
}

let i=1;
function gameLoop() {
    i%=28;
    if(i==0) i=1;

    baloon_frame = sprite.getFrame('venus/'+i+'.png'); // instance of Sprite
    console.log("gameLoop()...");
    let x=100;
    let y=100;
    // let ar=baloon_frame.getWidth()/baloon_frame.getHeight();
    // let w=61;
    // let h=(1/ar)*61;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let w=baloon_frame.getWidth();
    let h=baloon_frame.getHeight();
    baloon_frame.draw(ctx, x, y, w, h);
    ctx.strokeStyle="green";
    ctx.strokeRect(x,y,w,h);
    
    // baloon_frame.piviotX=w/2;
    // baloon_frame.piviotY=h/2;
    // baloon_frame.rotation+=0.1;
    i++;
    setTimeout(gameLoop,50);

    // requestAnimationFrame(gameLoop);
}
