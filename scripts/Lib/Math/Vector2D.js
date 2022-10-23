export class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    fromAngle(angle_radians) {
        let x = Math.cos(angle_radians);
        let y = Math.sin(angle_radians);
        return new Vector2D(x, y);
    }
    copy() {
        return new Vector2D(this.x, this.y);
    }
    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    add(vec2) {
        if (!(vec2 instanceof Vector2D)) {
            throw Error(" invalid object passed as vector2D");
        }
        this.x += vec2.x;
        this.y += vec2.y;
        return this;
    }

    subtract(vec2) {
        if (!(vec2 instanceof Vector2D)) {
            throw Error(" invalid object passed as vector2D");
        }
        this.x -= vec2.x;
        this.y -= vec2.y;
        return this;
    }

    scale(factor) {
        if (isNaN(factor)) {
            throw Error("Error: scaling by NaN");
        }
        this.x *= factor;
        this.y *= factor;
        return this;

    }
    mag() {
        return Math.hypot(this.y, this.x);
    }
    normalize() {
        let mag = this.mag();
        this.x /= mag;
        this.y /= mag;
        return this;
    }
    magSq() {
        return (this.x ** 2 + this.y ** 2);
    }
}
