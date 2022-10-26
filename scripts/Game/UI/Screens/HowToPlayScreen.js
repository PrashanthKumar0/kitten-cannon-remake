import { Vector2D } from "../../../Lib/Math/Vector2D.js";
import Button from "../Button.js";

export default class HowToPlayScreen {
    constructor(canvas2D_context, screens_sprite, button_font_family) {
        this.__ctx = canvas2D_context;
        this.__sprite_sheet = screens_sprite;
        this.__button_font_family = button_font_family;
        this.__frame = screens_sprite.getFrame("how_to_play_screen.png");
        this.onBackClick = () => { };
        this.buttons = {};
        this.visible = true;
        this.__create_buttons();
    }
    __create_buttons() {
        let canvas_w_half = this.__ctx.canvas.width / 2;
        let canvas_h = this.__ctx.canvas.height;
        let font_size = 70;
        this.__ctx.font = font_size + "px " + this.__button_font_family;

        { // Start button
            let text = "Back";
            let font_width = this.__ctx.measureText(text).width / 2; // why?
            let position = new Vector2D(canvas_w_half - font_width / 2, canvas_h - 80);

            this.buttons["start"] = new Button(this.__ctx, text, position, 60, "#000", this.__button_font_family);
            this.buttons["start"].onClick = () => {
                this.onBackClick();
            }
        }
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