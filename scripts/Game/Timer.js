export default class Timer {
    constructor() {
        this.then = performance.now();
    }
    getTickS() { // get tick in seconds
        let now = performance.now();
        let dt = (now - this.then) / 1000;
        this.then = now;
        return dt;
    }
}