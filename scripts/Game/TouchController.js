import { Vector2D } from "../Lib/Math/Vector2D.js";

export const TOUCH_EVENT_TYPES = {
    "undefined": 0b1,
    "up": 0b1 << 1,
    "down": 0b1 << 2,
}

export const TOUCH_INFORMATION = {
    position: new Vector2D(0, 0),
    eventType: TOUCH_EVENT_TYPES.undefined,
};
addEventListener("touchend", (event) => {
    TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.up;
});
// addEventListener("touchcancel")
addEventListener("touchstart", (event) => {
    // console.log(event.touches[0].clientX);
    TOUCH_INFORMATION.position.x = event.touches[0].clientX;
    TOUCH_INFORMATION.position.y = event.touches[0].clientY;
    TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.down;
});
// addEventListener("touchmove",(event)=>{
//     // // console.log(event.touches[0].clientX);
//     // TOUCH_INFORMATION.position.x=event.touches[0].clientX;
//     // TOUCH_INFORMATION.position.y=event.touches[0].clientY;
// });

addEventListener("mousedown", (event) => {
    TOUCH_INFORMATION.position.x = event.clientX;
    TOUCH_INFORMATION.position.y = event.clientY;
    TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.down;
});

addEventListener("mouseup", (event) => {
    TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.up;
});
addEventListener("blur", (event) => {
    TOUCH_INFORMATION.eventType = TOUCH_EVENT_TYPES.up;
});
