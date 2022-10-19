import SpriteSheet from "./SpriteSheet.js";
import Frame from "./Frame.js";

export default class SpriteAnimator {
    constructor(animation_name, sprite_sheet) {

        if (!(sprite_sheet instanceof SpriteSheet)) throw Error(" provied parameter isn't valid SpriteSheet ");

        this.__sprite_sheet = sprite_sheet;
        this.__animation_frames = null;
        this.animation_name = animation_name;

        try {
            this.__animation_frames = sprite_sheet.getAnimationFrames(animation_name);
        } catch (err) {
            this.__animation_frames = null;
            throw new Error(err);
        }

        this.__frameIndex = 0;
        this.loop = false;
        this.onComplete = () => { };
    }

    getCurrentFrame() {
        let frame_name = this.__animation_frames[this.__frameIndex];
        if (!frame_name) {
            throw Error(" frame at index " + this.__frameIndex + " not found \n in animation " + this.animation_name + " \n in sprite " + this.__sprite_sheet.name);
        }
        return this.__sprite_sheet.getFrame(frame_name);
    }
    reset() {
        this.__frameIndex = 0;
    }
    proceed() {
        if (this.__frameIndex < this.__animation_frames.length - 1) {
            this.__frameIndex++;
        } else {
            if (this.loop) this.__frameIndex = 0;
            else this.onComplete();
        }
    }
}
