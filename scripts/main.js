import { $ } from "./utils.js";





let canvas, ctx;

function main() {
    canvas = $("cnvs");
    canvas.width=innerWidth;
    canvas.height=innerHeight;
    ctx = canvas.getContext("2d");
}

window.onload = main;