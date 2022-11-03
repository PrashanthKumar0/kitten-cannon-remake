import { Vector2D } from "../../Lib/Math/Vector2D.js";

export default class HeightDisplay {
    constructor(renderer, pixel_per_feet, font_family) {
        this.__renderer = renderer;
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
            let text = ((Math.abs(this.kittenPosition.y) + this.__renderer.camera.getHeight()) / this.__pixel_per_feet).toFixed(0);
            this.__renderer.lineThickness = 2;
            let pos = new Vector2D(this.kittenPosition.x + this.width / 2, 22);
            let font_w = this.__renderer.getFontWidth(text, this.font_size, this.font_family);


            this.__renderer.drawSolidRect(this.kittenPosition.x, 20, this.height, this.width, "#000");
            this.__renderer.drawOutlinedRect(this.kittenPosition.x, 20, this.height, this.width, "red");
            this.__renderer.drawTopSemiCircle(pos.x, pos.y - 2, 10, "#000", "red");


            this.__renderer.drawSolidText(
                text,
                this.kittenPosition.x + this.width / 2 - font_w / 2,
                20 + this.height / 2,
                "red",
                this.font_size,
                this.font_family,
                "middle"
            );

        }
    }
}