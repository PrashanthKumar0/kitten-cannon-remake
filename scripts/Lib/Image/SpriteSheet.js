import "../Shapes/Rectangle.js";
import  Frame  from "./Frame.js";

export default class SpriteSheet {
    constructor(sprite_url, image_extension = '.png') {
        // ! PUBLIC

        this.name = sprite_url;
        this.url = sprite_url;
        this.img_src = sprite_url + image_extension;
        this.json_src = sprite_url + '.json';

        // ! Private
        this.__image = null;
        this.__json = null;
        this.__loaded = false;
    }


    async load() {
        // load json file
        await fetch(this.json_src)
            .then(res => res.json())
            .then(
                ((json) => {
                    this.__json = json;
                }).bind(this)
            )
            .catch(err => { throw new Error(err); });

        // load the image file
        await new Promise(function (resolve, reject) {
            this.__image = new Image();
            this.__image.src = this.img_src;
            this.__image.onload = resolve;
            this.__image.onerror = reject;
        }.bind(this))
            .then(res => { })
            .catch(err => { throw new Error(err); })


        this.__loaded = true;
        return this;
    }

    getFrame(frame_name){
        let frame=this.__json.frames[frame_name];
        if(!frame){
            throw Error(" frame name "+frame_name+" not found in "+this.sprite_url);
        }
        return new Frame(frame,this.__image);
    }
    
    getAnimationFrames(animation_name){
        let anim_data=null;
        if(!(anim_data=this.__json.animations[animation_name])) throw Error(" Invalid animation Name " + animation_name);
        return anim_data;
    }
}