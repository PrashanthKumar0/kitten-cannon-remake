import { Vector2D } from "../../Lib/Math/Vector2D.js";
import GameObject from "./GameObject.js";

export default class Spike extends GameObject {
    constructor(renderer, sprite_sheet, position) {
        let height = 140;
        super(renderer, sprite_sheet, position, height, "spikes");
        this.relativeHitBox = {
            'position': new Vector2D(110, 32),
            'width': 110,
            'height': this.height - 50,
        };
    }
}