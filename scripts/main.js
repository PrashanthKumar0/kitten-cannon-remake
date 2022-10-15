import { $ } from "./utils.js";





let canvas, ctx;

function main() {
    canvas = $("cnvs");
    canvas.width=640;
    canvas.height=480;
    ctx = canvas.getContext("2d");
}

window.onload = main;