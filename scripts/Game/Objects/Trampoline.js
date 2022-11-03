import { Vector2D } from "../../Lib/Math/Vector2D.js";
import GameObject from "./GameObject.js";

export default class Trampoline extends GameObject{
    constructor(renderer, sprite_sheet, position) {
        let height = 80;
        super(renderer, sprite_sheet, position, height, "trampoline");
        
        this.relativeHitBox = {
            'position': new Vector2D(26, 26),
            'width': this.width / 1.5,
            'height': this.height / 2,
        };
    }
}