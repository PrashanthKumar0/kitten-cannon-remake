import { Vector2D } from "../../Lib/Math/Vector2D.js";
import GameObject from "./GameObject.js";

export default class Venus extends GameObject {
    constructor(renderer, sprite_sheet, position) {
        let height = 200;
        super(renderer, sprite_sheet, position, height, "venus");
        this.relativeHitBox = {
            'position': new Vector2D(30, 28),
            'width': 50,
            'height': 50,
        };
    }
}