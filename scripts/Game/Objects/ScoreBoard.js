import { Vector2D } from "../../Lib/Math/Vector2D.js";
import Button from "../UI/Button.js";

export default class ScoreBoard {
    constructor(canvas2D_context) {
        this.__ctx = canvas2D_context;
        this.score = "";
        this.highScore = "";
        this.visible = false;
        this.buttons = {};
        this.__create_buttons();
    }

    __create_buttons() {

        let canvas_w_half = this.__ctx.canvas.width / 2;
        let canvas_h_half = this.__ctx.canvas.height / 2;

        { // Continue button
            let text = "Continue";
            let font_width = this.__ctx.measureText(text).width;
            let position = new Vector2D(canvas_w_half - font_width * 3 / 2, canvas_h_half);
            this.buttons["continue"] = new Button(this.__ctx, text, position, 44, "#ff680b", "Test");
        }

        { // Exit to menu button
            let text = "Exit to menu";
            let font_width = this.__ctx.measureText(text).width;
            let position = new Vector2D(canvas_w_half - font_width * 3 / 2, canvas_h_half + 38);
            this.buttons["exit_to_continue"] = new Button(this.__ctx, text, position, 44, "#666", "Test");
        }
    }

    draw() {
        if (!this.visible) return;
        let canvas_w_half = this.__ctx.canvas.width / 2;
        let canvas_h_half = this.__ctx.canvas.height / 2;

        { // Board  && Legs

            let boardW = 512;
            let boardH = 300;
            this.__ctx.lineWidth = 5;

            // Board
            this.__ctx.fillStyle = "#FFF";
            this.__ctx.strokeStyle = "#960";
            this.__ctx.fillRect(canvas_w_half - boardW / 2, canvas_h_half - boardH / 2 - 50, boardW, boardH);
            this.__ctx.strokeRect(canvas_w_half - boardW / 2, canvas_h_half - boardH / 2 - 50, boardW, boardH);

            // Legs
            this.__ctx.fillStyle = "#960";
            this.__ctx.strokeStyle = "#83520c";
            this.__ctx.fillRect(canvas_w_half - boardW / 2 + 76, canvas_h_half + boardH / 2 - 70, 15, 120);
            this.__ctx.strokeRect(canvas_w_half - boardW / 2 + 76, canvas_h_half + boardH / 2 - 70, 15, 120);
            this.__ctx.fillRect(canvas_w_half + boardW / 2 - 106, canvas_h_half + boardH / 2 - 70, 15, 120);
            this.__ctx.strokeRect(canvas_w_half + boardW / 2 - 106, canvas_h_half + boardH / 2 - 70, 15, 120);

            // Nuts
            this.__ctx.fillStyle = "#bbb";
            this.__ctx.beginPath();
            this.__ctx.arc(canvas_w_half - boardW / 2 + 76 + 15 / 2, canvas_h_half + boardH / 2 - 70 + 15 / 2, 15 / 2 - 2, 0, Math.PI * 2);
            this.__ctx.closePath();
            this.__ctx.fill();

            // this.__ctx.fillStyle = "#555";
            this.__ctx.beginPath();
            this.__ctx.arc(canvas_w_half + boardW / 2 - 106 + 15 / 2, canvas_h_half + boardH / 2 - 70 + 15 / 2, 15 / 2 - 2, 0, Math.PI * 2);
            this.__ctx.closePath();
            this.__ctx.fill();


        }

        this.__ctx.textBaseline = "top";
        { // Score
            this.__ctx.font = "130px Test";
            this.__ctx.fillStyle = "#060";
            let txt = this.score + " ft";
            let font_width = this.__ctx.measureText(txt).width;
            this.__ctx.fillText(txt, canvas_w_half - font_width / 2, canvas_h_half - 198);
        }
        { // High Score
            let txt = "Your High Score: " + this.highScore + " ft";
            this.__ctx.font = "44px Test";
            this.__ctx.fillStyle = "#060";
            // this.__ctx.fillStyle = "#000";
            let font_width = this.__ctx.measureText(txt).width;
            this.__ctx.fillText(txt, canvas_w_half - font_width / 2 + 6, canvas_h_half - 68);
        }
        for (let key in this.buttons) {
            this.buttons[key].draw();
        }

    }
    update() {

    }
}