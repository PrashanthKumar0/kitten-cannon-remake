import { toRadians } from "../Math/functions.js";

export default class Frame {
    constructor(data, image) {
        if ((typeof data) != (typeof {})) throw " given data isn't valid ";
        if (!(image instanceof Image)) throw " given image isn't valid ";
        this.__data = data;
        this.__sprite_image = image;
    
        this.__aspect_ratio=this.getWidth()/this.getHeight();
        // todo : add piviot x,y and piviotCenter()
    }

    getWidth() {
        return this.__data.sourceSize.w;
    }

    getHeight() {
        return this.__data.sourceSize.h;
    }

    getAspectRatio(){
        return this.__aspect_ratio;
    }

    // TODO : Refactor  DRY 
    draw(canvas2D_context, destination_x=0, destination_y=0, destination_width=undefined, destination_height=undefined) {
        let source_x = this.__data.frame.x;
        let source_y = this.__data.frame.y;
        let source_w = this.__data.rotated ? this.__data.frame.h : this.__data.frame.w;
        let source_h = this.__data.rotated ? this.__data.frame.w : this.__data.frame.h;
        
        if(!(destination_height && destination_width)){
            destination_height=source_h;
            destination_width=source_w;
        } 

        if (this.__data.rotated) {

            let dw = this.__data.rotated ? destination_height : destination_width;
            let dh = this.__data.rotated ? destination_width : destination_height;

            canvas2D_context.save(); {

                canvas2D_context.translate(
                    destination_x,
                    destination_y
                );
                canvas2D_context.rotate(toRadians(-90));
                canvas2D_context.drawImage(
                    this.__sprite_image,
                    source_x,
                    source_y,
                    source_w,
                    source_h,
                    -dw,
                    0,
                    dw,
                    dh,
                );


            } canvas2D_context.restore();
        } else {
            canvas2D_context.drawImage(
                this.__sprite_image,
                source_x,
                source_y,
                source_w,
                source_h,
                destination_x,
                destination_y,
                destination_width,
                destination_height,
            );
        }
    }
};