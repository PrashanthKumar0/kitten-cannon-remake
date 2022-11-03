import { Vector2D } from "../Math/Vector2D.js";

export default class Camera2D {
    constructor(viewport_width, viewport_height, target_vector2D = new Vector2D(0, 0)) {
        if (!(target_vector2D instanceof Vector2D))
            throw Error(" target Position is not instance of Vector2D ");

        this.target = target_vector2D;
        this.viewport_width = viewport_width;
        this.viewport_height = viewport_height;
        this.position = target_vector2D;
        this.follow(target_vector2D);
    }

    getWidth() {
        return this.viewport_width;
    }
    getHeight() {
        return this.viewport_height;
    }
    getAspectRatio() {
        return this.getWidth() / this.getHeight();
    }
    getPosition() {
        return this.position.copy();
    }
    getTargetPosition() {
        return this.target.copy();
    }
    getRelativePosition(Vector2D_world_position) {
        return Vector2D_world_position.copy().subtract(this.position);
    }
    getLocalPosition(Vector2D_world_position) { // alias
        return this.getRelativePosition(Vector2D_world_position);
    }

    follow(target_vector2D, lerp_amount = 0.8) {
        if (!(target_vector2D instanceof Vector2D))
            throw Error(" target Position is not instance of Vector2D ");
        this.position.lerp(target_vector2D.copy().subtract(new Vector2D(this.viewport_width / 2, this.viewport_height / 2)), lerp_amount);

    }
}