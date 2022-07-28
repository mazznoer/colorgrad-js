#!/usr/bin/env node

import benchmark from "benchmark";
import colorgrad from "@mazznoer/colorgrad";
import chroma from "chroma-js";
import * as d3_scale from "d3-scale";
import tinygradient from "tinygradient";
import interpolate from "color-interpolate";

const g_colorgrad = colorgrad.custom_gradient(["red", "green", "blue"]);
const g_chroma = chroma.scale(["red", "green", "blue"]);
const g_d3_scale = d3_scale.scaleLinear([0, 0.5, 1], ["red", "green", "blue"]);
const g_tinygradient = tinygradient(["red", "green", "blue"]);
const g_color_interpolate = interpolate(["red", "green", "blue"]);

//console.log("@mazznoer/colorgrad", g_colorgrad.at(0.75).hex());
//console.log("chroma", g_chroma(0.75).hex());
//console.log("d3-scale", g_d3_scale(0.75));
//console.log("tinygradient", g_tinygradient.rgbAt(0.75).toHex());
//console.log("color-interpolate", g_color_interpolate(0.75));

let suite = new benchmark.Suite;

suite.add("@mazznoer/colorgrad", function() {
        g_colorgrad.at(0.75);
    })
    .add("chroma-js", function() {
        g_chroma(0.75);
    })
    .add("d3-scale", function() {
        g_d3_scale(0.75);
    })
    .add("tinygradient", function() {
        g_tinygradient.rgbAt(0.75);
    })
    .add("color-interpolate", function() {
        g_color_interpolate(0.75);
    })
    .on("cycle", function(event) {
        console.log(String(event.target));
    })
    .on("complete", function() {
        console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({
        "async": true
    });