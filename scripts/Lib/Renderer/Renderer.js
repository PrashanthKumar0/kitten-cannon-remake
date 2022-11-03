import Camera2D from "../Camera2D/Camera2D.js";
import Frame from "../Image/Frame.js";
import { Vector2D } from "../Math/Vector2D.js";
// isnt affected by camera's y position
export default class Renderer {
    constructor(canvas2D_context, camera2D_camera) {
        if (!(camera2D_camera instanceof Camera2D))
            throw new Error(" the given parameter is not instance of Camera2D class");

        this.canvas = canvas2D_context.canvas;
        this.ctx = canvas2D_context;
        this.camera = camera2D_camera;
        this.imageSmoothingEnabled = true;
        this.lineThickness = 1;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawSolidRect(x, y, w, h, color = "magenta") {
        let local_pos = this.camera.getLocalPosition(new Vector2D(x, y));
        local_pos.y = y; // isnt affected by camera's y position

        this.ctx.fillStyle = color;
        this.ctx.fillRect(local_pos.x, local_pos.y, w, h);

    }
    drawOutlinedRect(x, y, w, h, color = "cyan") {
        let local_pos = this.camera.getLocalPosition(new Vector2D(x, y));
        local_pos.y = y; // isnt affected by camera's y position

        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(local_pos.x, local_pos.y, w, h);

    }
    drawCenteredFrame(frame, x, y, w, h, rotation = 0) {
        this.drawPivotedFrame(frame, x, y, w, h, new Vector2D(w / 2, h / 2), rotation)
    }
    drawPivotedFrame(frame, x, y, w, h, pivot_vector2D, rotation = 0) {
        if (!(pivot_vector2D instanceof Vector2D)) {
            throw new Error(" provided argument is not instance of Vector2D");
        }
        this.ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;

        let local_pos = this.camera.getLocalPosition(new Vector2D(x, y));
        local_pos.y = y; // isnt affected by camera's y position


        this.ctx.save();
        this.ctx.translate(local_pos.x + pivot_vector2D.x, local_pos.y + pivot_vector2D.y);
        this.ctx.rotate(rotation);
        frame.draw(this.ctx, -pivot_vector2D.x, -pivot_vector2D.y, w, h);
        this.ctx.restore();
    }
    drawFrame(frame, x, y, w, h) {
        this.ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;

        let local_pos = this.camera.getLocalPosition(new Vector2D(x, y));
        local_pos.y = y; // isnt affected by camera's y position

        frame.draw(this.ctx, local_pos.x, local_pos.y, w, h);
        this.ctx.imageSmoothingEnabled = true;


    }
    drawSolidText(text, x, y, color = "#000", fontSize = 25, fontFamily = "Arial", textBaseline = "top") {
        this.ctx.textBaseline = textBaseline;
        this.ctx.font = fontSize + "px " + fontFamily;
        this.ctx.fillStyle = color;

        let local_pos = this.camera.getLocalPosition(new Vector2D(x, y));
        local_pos.y = y; // isnt affected by camera's y position

        this.ctx.fillText(text, local_pos.x, local_pos.y);
    }

    drawCircle(x, y, r, fill_color, outline_color = "transparent") {
        this.ctx.fillStyle = fill_color;
        this.ctx.lineWidth = this.lineThickness;
        this.ctx.strokeStyle = outline_color;
        this.ctx.beginPath();

        let local_pos = this.camera.getLocalPosition(new Vector2D(x, y));
        local_pos.y = y; // isnt affected by camera's y position


        this.ctx.arc(local_pos.x, local_pos.y, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawTopSemiCircle(x, y, r, fill_color, outline_color = "transparent") {
        this.ctx.fillStyle = fill_color;
        this.ctx.lineWidth = this.lineThickness;
        this.ctx.strokeStyle = outline_color;
        this.ctx.beginPath();

        let local_pos = this.camera.getLocalPosition(new Vector2D(x, y));
        local_pos.y = y; // isnt affected by camera's y position


        this.ctx.arc(local_pos.x, local_pos.y, r, 0, Math.PI, true);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }
    getFontWidth(text, font_size, font_family) {
        this.ctx.font = font_size + "px " + font_family;
        return this.ctx.measureText(text).width;
    }
}