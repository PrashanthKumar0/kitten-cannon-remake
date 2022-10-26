import { Vector2D } from "../../../Lib/Math/Vector2D.js";
import Button from "../Button.js";

export default class MenuScreen {
    constructor(canvas2D_context, screens_sprite, button_font_family) {
        this.__ctx = canvas2D_context;
        this.__sprite_sheet = screens_sprite;
        this.__button_font_family = button_font_family;
        this.__frame = screens_sprite.getFrame("menu_screen.png");
        this.onStartClick = () => { };
        this.onHelpClick = () => { };
        this.onCreditsClick = () => { };
        this.buttons = {};
        this.visible = true;
        this.__create_buttons();
    }
    __create_buttons() {
        let canvas_w_half = this.__ctx.canvas.width / 2;
        let canvas_h_half = this.__ctx.canvas.height / 2;
        let font_size = 70;
        this.__ctx.font = font_size + "px " + this.__button_font_family;

        { // Start button
            let text = "Start";
            let font_width = this.__ctx.measureText(text).width/2; // why?
            let position = new Vector2D(canvas_w_half - font_width / 2, canvas_h_half + 30);
            this.buttons["start"] = new Button(this.__ctx, text, position, 60, "#000", this.__button_font_family);
            this.buttons["start"].onClick = () => {
                this.onStartClick();
            }
        }

        { // how to play button
            let text = "How To Play";
            let font_width = this.__ctx.measureText(text).width/2;
            let position = new Vector2D(canvas_w_half - font_width / 2, canvas_h_half + 30 + 80);
            this.buttons["howToPlay"] = new Button(this.__ctx, text, position, 60, "#000", this.__button_font_family);
            this.buttons["howToPlay"].onClick = () => {
                this.onHelpClick();
            }
        }
        { // how to play button
            let text = "Credits";
            let font_width = this.__ctx.measureText(text).width/2;
            let position = new Vector2D(canvas_w_half - font_width / 2, canvas_h_half + 30 + 160);
            this.buttons["credits"] = new Button(this.__ctx, text, position, 60, "#000", this.__button_font_family);
            this.buttons["credits"].onClick = () => {
                this.onCreditsClick();
            }
        }



        // { // Start button
        //     let text = "Start";
        //     let font_width = this.__ctx.measureText(text).width;
        //     let position = new Vector2D(canvas_w_half - font_width * 3 / 2, canvas_h_half - 10);
        //     this.buttons["start"] = new Button(this.__ctx, text, position, 44, "#ff680b", "Test");
        //     this.buttons["start"].onClick = () => {
        //         this.onStartClick();
        //     }
        // }



    }
    updateClickInput(cursor_position_vec) {
        if (!this.visible) return;
        if (!(cursor_position_vec instanceof Vector2D)) throw Error(" Cursor position should be a vector2D .");
        for (let button_key in this.buttons) {
            this.buttons[button_key].updateClickInput(cursor_position_vec);
        }
    }
    draw() {

        if (!this.visible) return;

        this.__frame.draw(this.__ctx, 0, 0, this.__ctx.canvas.width, this.__ctx.canvas.height);

        for (let key in this.buttons) {
            this.buttons[key].draw();
        }

    }
}