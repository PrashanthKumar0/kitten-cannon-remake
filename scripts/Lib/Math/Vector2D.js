export class Vector2D{
    constructor(x=0,y=0){
        this.x=x;
        this.y=y;
    }
    fromAngle(angle_radians){
        let x = Math.cos(angle_radians);
        let y = Math.sin(angle_radians);
        return new Vector2D(x,y);
    }


    add(vec2){
        if(!(vec2 instanceof Vector2D)){
            throw Error(" invalid object passed as vector2D");
        }
        this.x+=vec2.x;
        this.y+=vec2.y;
        return this;
    }

    scale(factor){
        if(isNaN(factor)){
            throw Error("Error: scaling by NaN");
        }
        this.x*=factor;
        this.y*=factor;
        return this;
    
    }
}