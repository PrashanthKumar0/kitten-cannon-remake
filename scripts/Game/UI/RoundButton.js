import { Vector2D } from "../../Lib/Math/Vector2D.js";

export default class RoundButton {
    constructor(canvas2D_context, char, position, radius, text_color = "white", bg_color = "Black", font_family = "Arial") {
        this.__ctx = canvas2D_context;
        this.position = position || new Vector2D(this.__ctx.canvas.width / 2, this.__ctx.canvas.height / 2);
        this.char = char;
        this.radius = radius;
        let width = radius * 2;
        this.width = width;
        this.font_family = font_family;
        this.text_color = text_color;
        this.bg_color = bg_color;
        this.height = this.radius * 2;
        this.font_size = this.radius;
        this.visible = true;
        this.__radiusSq=this.radius * this.radius;
        this.onClick = () => { };
    }
    draw() {
        if (!this.visible) return;
        this.__ctx.textBaseline = "middle";
        this.__ctx.font = this.font_size + "px " + this.font_family;
        
        this.width = this.__ctx.measureText(this.char).width;
        
        this.__ctx.fillStyle = this.bg_color;
        this.__ctx.beginPath();
        this.__ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.__ctx.closePath();
        this.__ctx.fill();

        this.__ctx.fillStyle = this.text_color;
        this.__ctx.fillText(this.char, this.position.x - this.width / 2, this.position.y);
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
        let diffVec = cursor_position_vec.copy().subtract(this.position).magSq();
        if (
            diffVec <= this.__radiusSq
        ) {
            this.onClick();
        }
    }
}