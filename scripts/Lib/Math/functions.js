export function toRadians(degree_angle) {
    return (Math.PI / 180) * degree_angle;
}
export function toDegree(radian_value) {
    return (radian_value) * (180 / Math.PI);
}
export function linearMap(val, x1, x2, y1, y2) {
    // val = x1 +> return y1   pt(x1,y1)
    // val = x2 +> return y2   pt(x2,y2)
    // (y) = ((y2-y1) / (x2-x1)) *  (val-x1)  + y1
    if (x2 == x1) return x1;
    return ((y2 - y1) / (x2 - x1)) * (val - x1) + y1;
}
export function checkRectRectCollision(obj1, obj2) {
    return (
        ((obj1.x + obj1.width >= obj2.x) && (obj1.x <= obj2.x + obj2.width))
        &&
        ((obj1.y + obj1.height >= obj2.y) && (obj1.y <= obj2.y + obj2.height))
    );
}