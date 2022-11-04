import { Vector2D } from "../../Lib/Math/Vector2D.js";
import GameObject from "./GameObject.js";

export default class Blast extends GameObject {
    constructor(renderer, sprite_sheet, position) {
        let height = 140;
        super(renderer, sprite_sheet, position, height, "blast_round");
    }
    draw() {
        let frame = this.__animator.getCurrentFrame();
        let ar = frame.getAspectRatio();
        

        { // centeral bright
            this.__renderer.drawCenteredFrame(frame, this.position.x, this.position.y, this.width, this.height);
        }

        
        { // bottom right 
            let pos = this.position.copy().add(new Vector2D(40, 45));
            let height = 100;
            let width = ar * height;
            this.__renderer.drawCenteredFrame(frame, pos.x, pos.y, width, height);
        }

        { // bottom left
            let pos = this.position.copy().add(new Vector2D(-12, 45));
            let height = 68;
            let width = ar * height;
            this.__renderer.drawCenteredFrame(frame, pos.x, pos.y, width, height);
        }


    }
}