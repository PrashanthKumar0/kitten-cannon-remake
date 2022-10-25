import { Vector2D } from "../../Lib/Math/Vector2D.js";

export default class HeightDisplay {
    constructor(ctx, pixel_per_feet, font_family) {
        this.__ctx = ctx;
        this.__pixel_per_feet = pixel_per_feet;
        this.position = new Vector2D(100, 100);
        this.kittenPosition = new Vector2D(0, 0);
        this.font_family = font_family;
        this.font_size = 50;
        this.width = 100;
        this.height = 100;
    }

    updateWithKittenPosition(kitten_position) {
        this.kittenPosition = kitten_position.copy();
    }
    draw() {
        if (this.kittenPosition.y < 0) {
            let text = ((Math.abs(this.kittenPosition.y) + this.__ctx.canvas.height) / this.__pixel_per_feet).toFixed(0);
            this.__ctx.font = this.font_size + "px " + this.font_family;
            this.__ctx.fillStyle = "#000";
            this.__ctx.lineWidth=2;
            this.__ctx.strokeStyle = "red";
            this.__ctx.fillRect(this.kittenPosition.x, 20, this.height, this.width);
            this.__ctx.strokeRect(this.kittenPosition.x, 20, this.height, this.width);
            
            this.__ctx.beginPath();
            this.__ctx.arc(this.kittenPosition.x + this.width / 2, 22, 10, 0, Math.PI, true);
            this.__ctx.fill();
            this.__ctx.stroke();
            this.__ctx.closePath();

            this.__ctx.fillStyle = "red";
            let font_w = this.__ctx.measureText(text).width;
            this.__ctx.fillText(text, this.kittenPosition.x + this.width / 2 - font_w / 2, 20 + this.height / 2, 100, 100);

        }
    }
}