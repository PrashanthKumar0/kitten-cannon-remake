import { Vector2D } from "../../Lib/Math/Vector2D.js";

export default class Button {
    constructor(canvas2D_context, text, position, font_size = 44, text_color = "Black", font_family = "Arial") {
        this.__ctx = canvas2D_context;
        this.position = position || new Vector2D(this.__ctx.canvas.width / 2, this.__ctx.canvas.height / 2);
        this.text = text || "Button";
        let width = this.__ctx.measureText(text).width;
        this.width = width;
        this.padding = new Vector2D(40, 0);
        this.font_family = font_family;
        this.text_color = text_color;
        this.height = font_size;
        this.font_size = font_size;
        this.visible = true;
        this.onClick = () => { };
    }
    draw() {
        if (!this.visible) return;
        this.__ctx.textBaseline = "top";
        this.__ctx.font = this.font_size + "px " + this.font_family;
        this.__ctx.strokeStyle = this.text_color;
        this.__ctx.fillStyle = this.text_color;
        this.width = this.__ctx.measureText(this.text).width;
        // this.__ctx.lineWidth = 1;
        // this.__ctx.strokeRect(this.position.x, this.position.y, this.width + this.padding.x, this.height + this.padding.y);
        // this.__ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.__ctx.fillText(this.text, this.position.x + this.padding.x / 2, this.position.y + this.padding.y / 2);
    }

    getHeight() {
        return this.height + this.padding.y;
    }

    getWidth() {
        return this.width + this.padding.x;
    }

    updateClickInput(cursor_position_vec) {
        if (!this.visible) return;
        if (!(cursor_position_vec instanceof Vector2D)) throw Error(" Cursor position should be a vector2D .");
        if (
            ((cursor_position_vec.x >= this.position.x) && (cursor_position_vec.x <= this.position.x + this.width + this.padding.x))
            &&
            ((cursor_position_vec.y >= this.position.y) && (cursor_position_vec.y <= this.position.y + this.height + this.padding.y))

        ) {
            this.onClick();
        }
    }
}