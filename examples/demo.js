#!/usr/bin/env node

import colorgrad from "@mazznoer/colorgrad";

let presets = ["sinebow", "rainbow", "turbo", "cividis", "cubehelix_default", "cool", "warm"];

for (let p of presets) {
    let grad = colorgrad[p]();
    console.log("preset", p);
    display_gradient(grad);
}

let data = [
    [
        ["fff", "00f"]
    ],
    [
        ["plum", "tomato", "brown", "gold"],
        [0, 0.5, 0.5, 1], "linear-rgb"
    ],
    [
        ["#C41189", "rgb(0,191,255)", "gold", "hsv(91,88%,50%)"]
    ],
    [
        ["red", "lime", "blue", "black"], null, "oklab", "catmull-rom"
    ],
    [
        ["hwb(200,10%,70%)", "hwb(220,45%,0%)"]
    ],
    [
        ["deeppink", "gold", "seagreen"], null, null, "catmull-rom"
    ],
];

for (let d of data) {
    console.log(JSON.stringify(d));
    try {
        let grad = colorgrad.custom_gradient(...d);
        display_gradient(grad);
    } catch (e) {
        console.log("error:", e);
    }
}

let ggr_str = `
GIMP Gradient
Name: Abstract 1
6
0.000000 0.286311 0.572621 0.269543 0.259267 1.000000 1.000000 0.215635 0.407414 0.984953 1.000000 0 0 0 0
0.572621 0.657763 0.716194 0.215635 0.407414 0.984953 1.000000 0.040368 0.833333 0.619375 1.000000 0 0 0 0
0.716194 0.734558 0.749583 0.040368 0.833333 0.619375 1.000000 0.680490 0.355264 0.977430 1.000000 0 0 0 0
0.749583 0.784641 0.824708 0.680490 0.355264 0.977430 1.000000 0.553909 0.351853 0.977430 1.000000 0 0 0 0
0.824708 0.853088 0.876461 0.553909 0.351853 0.977430 1.000000 1.000000 0.000000 1.000000 1.000000 0 0 0 0
0.876461 0.943172 1.000000 1.000000 0.000000 1.000000 1.000000 1.000000 1.000000 0.000000 1.000000 0 0 0 0`;

console.log("GIMP gradient");
try {
    let ggr = colorgrad.parse_ggr(ggr_str.trim(), "000", "fff");
    display_gradient(ggr);
} catch (e) {
    console.log("error:", e);
}

function display_gradient(grad, width = 100) {
    let colors = grad.colors(width * 2);
    for (let i = 0; i < width; i++) {
        let [r0, g0, b0, a0] = colors.shift().rgba8();
        let [r1, g1, b1, a1] = colors.shift().rgba8();
        process.stdout.write(`\u001B[38;2;${r0};${g0};${b0};48;2;${r1};${g1};${b1}m\u{258C}`);
    }
    console.log("\u001B[39;49m");
}