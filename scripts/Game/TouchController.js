import { linearMap } from "../Lib/Math/functions.js";
import { Vector2D } from "../Lib/Math/Vector2D.js";

export const TOUCH_EVENT_TYPES = {
    "undefined": 0b1,
    "up": 0b1 << 1, // up and click have same effect . kind of alias
    "click": 0b1 << 1,
    "down": 0b1 << 2,
}
Object.freeze(TOUCH_EVENT_TYPES);
export const TOUCH_INFORMATION = {
    position: new Vector2D(0, 0),
    eventType: TOUCH_EVENT_TYPES.undefined,
};
addEventListener("touchend", (event) => {
    TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.up;
});

addEventListener("touchstart", (event) => {
    TOUCH_INFORMATION.position.x = event.touches[0].clientX - event.target.offsetLeft;
    TOUCH_INFORMATION.position.y = event.touches[0].clientY - event.target.offsetTop;
    TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.down;
});

addEventListener("click", (event) => {
    TOUCH_INFORMATION.position.x = event.clientX - event.target.offsetLeft;
    TOUCH_INFORMATION.position.y = event.clientY - event.target.offsetTop;
    TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.click;
    setTimeout(() => {
        TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.up;
    }, 250);
});
addEventListener("mousedown", (event) => {
    TOUCH_INFORMATION.position.x = event.clientX - event.target.offsetLeft;
    TOUCH_INFORMATION.position.y = event.clientY - event.target.offsetTop;
    TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.down;
});

addEventListener("mouseup", (event) => {
    TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.up;
});
addEventListener("blur", (event) => {
    TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.up;
});

export function map_coord_to_canvas(touch_position_vector, canvas_element) {
    let x = linearMap(touch_position_vector.x, 0, canvas_element.clientWidth, 0, canvas_element.width);
    let y = linearMap(touch_position_vector.y, 0, canvas_element.clientHeight, 0, canvas_element.height);
    return new Vector2D(x, y);
}