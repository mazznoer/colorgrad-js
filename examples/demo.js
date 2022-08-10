#!/usr/bin/env node

import fs from "fs";
import colorgrad from "colorgrad-js";

// Preset gradients

let presets = ["sinebow", "rainbow", "turbo", "cividis", "cubehelixDefault", "cool", "warm"];

for (let p of presets) {
    const grad = colorgrad[p]();
    console.log("preset", p);
    display_gradient(grad);
}

// Custom gradients

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
        const grad = colorgrad.customGradient(...d);
        display_gradient(grad);
    } catch (e) {
        console.log("error:", e);
    }
}

// GIMP gradients

try {
    fs.readFile("Abstract_1.ggr", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Abstract_1.ggr");
        const ggr = colorgrad.parseGGR(data, "000", "fff");
        display_gradient(ggr);
    });

    fs.readFile("Full_saturation_spectrum_CW.ggr", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Full_saturation_spectrum_CW.ggr");
        const ggr = colorgrad.parseGGR(data, "000", "fff");
        display_gradient(ggr);
    });
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
