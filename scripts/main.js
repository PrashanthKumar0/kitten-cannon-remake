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
import ScoreBoard from "./Game/Objects/ScoreBoard.js";
import * as TouchController from "./Game/TouchController.js";
import RoundButton from "./Game/UI/RoundButton.js";
import HeightDisplay from "./Game/Objects/HeightDisplay.js";
import MenuScreen from "./Game/UI/Screens/MenuScreen.js";
import HowToPlayScreen from "./Game/UI/Screens/HowToPlayScreen.js";
import { linearMap } from "./Lib/Math/functions.js";
import Creditscreen from "./Game/UI/Screens/CreditsScreen.js";
import Timer from "./Game/Timer.js";
import SoundManager from "./Game/SoundManager.js";

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
let screens_sprite;
let grass, cannon;
let ground_ref;
let kitty;
const OBJECT_GAP = 800;
let objectGenerator;
let score_board;
let distance_travelled_px = 0;
let highest_distance_travelled_px = 0;
let should_reset = false;
let fire_button;
let up_button;
let down_button;
let height_display;
// 400 px = 1 meter
const pixel_per_feet = 400;
let skip_frames = 0;
let max_skip_frames = 0;
let menu_screen;
let how_to_play_screen;
let credits_screen;

let timer;

let sound_manager;

const GAME_SCREENS_E = {
    "Preload": 0b1,
    "Splash": 0b1 << 1,
    "Menu": 0b1 << 2,
    "Play": 0b1 << 3,
    "Help": 0b1 << 4,
    "Credits": 0b1 << 5,
};
let CURRENT_GAME_SCREEN = GAME_SCREENS_E.Preload;


function reset_game() {
    should_reset = false;
    score_board.visible = false;
    grass = new Grass(ctx, sprite);
    cannon = new Cannon(ctx, sprite);
    kitty = new Kitten(ctx, sprite);
    objectGenerator = new ObjectGenerator(ctx, sprite, kitty, OBJECT_GAP);
    fire_button = new RoundButton(ctx, "🔥", new Vector2D(canvas.width - 200, canvas.height - 200), 34, "white", "black", "Test");
    up_button = new RoundButton(ctx, "👆", new Vector2D(canvas.width - 100, canvas.height - 250), 34, "white", "black", "Test");
    down_button = new RoundButton(ctx, "👇", new Vector2D(canvas.width - 100, canvas.height - 150), 34, "white", "black", "Test");
    height_display = new HeightDisplay(ctx, pixel_per_feet, "Test");
    timer = new Timer();

    ground_ref = canvas.height - 60;
    // score reset
    distance_travelled_px = 0;
    add_button_events();
    timer.getTickS();
}

function hide_buttons() {
    fire_button.visible = false;
    up_button.visible = false;
    down_button.visible = false;
}


function add_button_events() {

    fire_button.onClick = (function () {
        console.log("kitty throw");
        throw_kitty();
    });
    up_button.onClick = (function () {
        console.log("barrel Up");
        cannon.barrelUp();
    });
    down_button.onClick = (function () {
        console.log("barrel Down");
        cannon.barrelDown();
    });



    // score board
    score_board.onContinue = (async function () {
        // reset_game();
        console.log("reset");
        should_reset = true;
    });
    score_board.onMenu = (async function () {
        console.log("Menu");
        CURRENT_GAME_SCREEN = GAME_SCREENS_E.Menu;
        max_skip_frames = skip_frames = 60;
    });


    menu_screen.onStartClick = function () {
        console.log("Start");
        CURRENT_GAME_SCREEN = GAME_SCREENS_E.Play;
        max_skip_frames = skip_frames = 60;
    }
    menu_screen.onHelpClick = function () {
        console.log("How To Play");
        CURRENT_GAME_SCREEN = GAME_SCREENS_E.Help;
        max_skip_frames = skip_frames = 60;
    }

    menu_screen.onCreditsClick = function () {
        console.log("How To Play");
        CURRENT_GAME_SCREEN = GAME_SCREENS_E.Credits;
        max_skip_frames = skip_frames = 60;
    }

    how_to_play_screen.onBackClick = function () {
        console.log("Back");
        CURRENT_GAME_SCREEN = GAME_SCREENS_E.Menu;
        max_skip_frames = skip_frames = 60;
    }

    credits_screen.onBackClick = function () {
        console.log("Back");
        CURRENT_GAME_SCREEN = GAME_SCREENS_E.Menu;
        max_skip_frames = skip_frames = 60;
    }

}

function handle_highScore() {
    if (distance_travelled_px > highest_distance_travelled_px) {
        highest_distance_travelled_px = distance_travelled_px;
    }
}


function throw_kitty() {
    if (!kitty.visible && !kitty.isDead) {
        cannon.barrelShoot();
        let barrelDir = cannon.getBarrelDirectionVector();
        kitty.visible = true;
        kitty.position = cannon.getBarrelEnd()
            .subtract(barrelDir.copy().scale(32))
            .subtract(new Vector2D(kitty.width / 2, kitty.height / 2));
        kitty.throw(barrelDir.scale((cannon.powerPercent / 100) * 80));
    }
    hide_buttons();
}

async function preload() {
    console.log("start loading");

    // TODO : use promises
    sprite = await new Sprite("assets/sprite_sheet/kitty_cannon_dat").load();
    console.log(sprite.name + " loaded...");
    screens_sprite = await new Sprite("assets/sprite_sheet/game_screens_dat").load();
    console.log(screens_sprite.name + " loaded...");
    score_board = new ScoreBoard(ctx);

    menu_screen = new MenuScreen(ctx, screens_sprite, "Test");
    how_to_play_screen = new HowToPlayScreen(ctx, screens_sprite, "Test");
    credits_screen = new Creditscreen(ctx, screens_sprite, "Test");
    // CURRENT_GAME_SCREEN = GAME_SCREENS_E.Play;
    highest_distance_travelled_px = 0; // todo : move this line in restart_game(); later
    sound_manager = new SoundManager();
    add_sounds();

    resize();
    reset_game();

    set_events();
}

function add_sounds() {
    sound_manager
        .addSound("woosh", "assets/audio_fx/1_whooshrev.m4a", 1.0)
        .addSound("after_load", "assets/audio_fx/2.m4a", 1.0)

        .addSound("hit1", "assets/audio_fx/5_hit1.m4a", 1.0)
        .addSound("hit2", "assets/audio_fx/4_hit2.m4a", 1.0)
        .addSound("hit3", "assets/audio_fx/3_hit3.m4a", 1.0)
        .addSound("hit4", "assets/audio_fx/2_hit4.m4a", 1.0)


        .addSound("cat1", "../assets/audio_fx/12_cat1.m4a", 1.0)
        .addSound("cat2", "../assets/audio_fx/11_cat2.m4a", 1.0)
        .addSound("cat3", "../assets/audio_fx/10_cat3.m4a", 1.0)
        .addSound("cat4", "../assets/audio_fx/9_cat4.m4a", 1.0)
        .addSound("cat5", "../assets/audio_fx/8_cat5.m4a", 1.0)
        .addSound("cat6", "../assets/audio_fx/7_cat6.m4a", 1.0)

        .addSound("tnt_blast", "../assets/audio_fx/191.m4a", 1.0)
        .addSound("spike", "../assets/audio_fx/203.m4a", 1.0)
        .addSound("swallow", "../assets/audio_fx/222.m4a", 1.0)
        .addSound("trampoline", "../assets/audio_fx/245.m4a", 1.0)
        .addSound("barrel", "../assets/audio_fx/375.m4a", 1.0)
        .addSound("baloon_blast", "../assets/audio_fx/378.m4a", 1.0)
        // .addSound("woosh", "../assets/audio_fx/311.m4a",1.0)
        // .addSound("woosh", "../assets/audio_fx/6_failure.m4a",1.0)


        .loadAll()
        .onLoad = function (sound_name, progress_percentage) {
            console.log("loaded sound " + sound_name, progress_percentage + " %", progress_percentage == 100 ? "{done}" : "")
            if (progress_percentage == 100) sound_manager.play("after_load").onended = function () {

            };
        }
}

function set_events() {
    // keyboard
    // KEYS.r = "r";
    // registerKeyEventCallback(KEYS.r, () => { cannon.resetCannon(); }); // temporarry

    registerKeyEventCallback(KEYS.w, () => {
        console.log("BarrelUp");
        cannon.barrelUp();
    });
    registerKeyEventCallback(KEYS.arrowup, () => {
        console.log("BarrelUp");
        cannon.barrelUp();
    });
    registerKeyEventCallback(KEYS.s, () => {
        console.log("BarrelDown");
        cannon.barrelDown();
    });
    registerKeyEventCallback(KEYS.arrowdown, () => {
        console.log("BarrelDown");
        cannon.barrelDown();
    });
    registerKeyEventCallback(KEYS.space, () => {
        console.log("kitty throw");
        throw_kitty();
    });
}

let bg = new Image();
bg.src = "ref_images/menu_screen.png";

function gameLoop() {
    requestAnimationFrame(gameLoop);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (skip_frames > 0) {
        skip_frames--;
        show_load_screen(skip_frames, max_skip_frames);
        return;
    }
    max_skip_frames = 0;
    skip_frames = 0;

    switch (CURRENT_GAME_SCREEN) {
        case GAME_SCREENS_E.Preload:
            preload_screen();
            break;
        case GAME_SCREENS_E.Splash:
            splash_screen();
            break;
        case GAME_SCREENS_E.Menu:
            render_screen(menu_screen);
            break;
        case GAME_SCREENS_E.Credits:
            render_screen(credits_screen);
            break;
        case GAME_SCREENS_E.Help:
            render_screen(how_to_play_screen);
            break;
        case GAME_SCREENS_E.Play:
            render_game_screen();
            break;
    }
    // setTimeout(gameLoop, 1000 / 60);
}

// screens
function render_screen(screen_class) {
    // ctx.drawImage(bg, canvas.width/2 - bg.width/2, 0);
    // ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    // ctx.strokeRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle="red";
    // ctx.font="50px Test1";
    // // ctx.fillText("kitten  cannon  is  very  simple",100,400);    
    screen_class.draw();
    if (TouchController.TOUCH_INFORMATION.eventType == TouchController.TOUCH_EVENT_TYPES.down) {
        let correct_pos = TouchController.map_coord_to_canvas(TouchController.TOUCH_INFORMATION.position, canvas);
        screen_class.updateClickInput(correct_pos);
    }
}

function show_load_screen(progress, max_progress) {
    ctx.fillStyle = "#dbedff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let frame = screens_sprite.getFrame("menu_screen.png");
    let frame_w = frame.getWidth();
    let frame_h = frame.getHeight();
    frame.draw(ctx, canvas.width / 2 - frame_w / 2, 0, frame_w, frame_h);
    let w = Math.floor(linearMap(progress, 0, max_progress, 0, canvas.width / 2));
    ctx.lineWidth = 2;
    ctx.fillStyle = "forestgreen";
    ctx.fillRect(canvas.width / 4 + 4, canvas.height / 2 + 4, w, 40);
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(canvas.width / 4, canvas.height / 2, w, 40);
    ctx.fillStyle = "forestgreen";
    ctx.strokeRect(canvas.width / 4, canvas.height / 2, w, 40);
    ctx.font = "60px Test";
    let text = "Loading ...";
    let font_w_half = ctx.measureText(text).width / 2;
    ctx.fillText(text, canvas.width / 2 - font_w_half, canvas.height / 2 + 100);
}

let targetFps = 60;

function render_game_screen() {
    let dt = timer.getTickS();
    let fps = (1 / dt);
    ctx.font = "50px Test";
    ctx.fillStyle = "#000";
    ctx.fillText("original FPS : " + fps.toFixed(0), 30, 30);
    { // delay to match fps <= targetFps
        let l_timer = new Timer();
        let fps_l = fps;
        let dt_accum = dt;
        while (fps_l >= targetFps) {
            dt_accum += l_timer.getTickS();
            fps_l = (1 / dt_accum);
        }
        ctx.fillText("apparent FPS : " + fps_l.toFixed(0), 30, 90);
    }
    // this will be in kitty.getScore();
    let distance_travelled = (distance_travelled_px / pixel_per_feet).toFixed(0);
    let highest_distance_travelled = (highest_distance_travelled_px / pixel_per_feet).toFixed(0);

    score_board.score = distance_travelled;
    score_board.highScore = highest_distance_travelled;
    score_board.draw();
    grass.draw();
    cannon.draw();
    kitty.draw();
    kitty.update();
    if (kitty.visible && !kitty.isDead) {
        grass.x -= kitty.velocity.x;
        cannon.x -= kitty.velocity.x;
        kitty.update_blood_particles(kitty.velocity.x); // these interfaces are bad for now 
        distance_travelled_px += kitty.velocity.x;
        // objectGenerator.update(kitty.velocity.x);
    }

    if (kitty.isDead) {
        handle_highScore();
        score_board.visible = true;
    }
    objectGenerator.update();
    let correct_pos = TouchController.map_coord_to_canvas(TouchController.TOUCH_INFORMATION.position, canvas);
    ctx.beginPath();
    ctx.arc(correct_pos.x, correct_pos.y, 4, 0, Math.PI * 2);
    ctx.fill();

    if (TouchController.TOUCH_INFORMATION.eventType == TouchController.TOUCH_EVENT_TYPES.down) {
        score_board.updateClickInput(correct_pos);
        fire_button.updateClickInput(correct_pos);
        up_button.updateClickInput(correct_pos);
        down_button.updateClickInput(correct_pos);
    }
    objectGenerator.drawAll();
    cannon.update();

    fire_button.draw();
    up_button.draw();
    down_button.draw();
    height_display.draw();
    height_display.updateWithKittenPosition(kitty.position);

    handleKeyboardCallbacks();

    if (should_reset) {
        reset_game();
    }

}


// utils

function resize() {
    if (canvas) {
        let canvas_ar = canvas.width / canvas.height;

        if (canvas_ar * innerHeight < innerWidth) {
            canvas.style.width = 'auto';
            canvas.style.height = '100vh';
        } else {
            canvas.style.width = '100vw';
            canvas.style.height = 'auto';
        }
    }
}

onresize = resize;