#!/usr/bin/env node

import benchmark from "benchmark";
import colorgrad from "colorgrad-js";
import chroma from "chroma-js";
import * as culori from "culori";
import * as d3_scale from "d3-scale";
import tinygradient from "tinygradient";
import interpolate from "color-interpolate";

const colors = [
    "#e830d8", "#bf6242", "#a0c433", "#8299d8", "#e5ca34", "#96d811", "#afffe3", "#079988",
    "#c0e88d", "#ed703b", "#233b8c", "#ede17b", "#6dea0e", "#30e8d5", "#8fc7fc", "#1ee824",
    "#38ea2e", "#fcc4d5", "#529915", "#c8f280", "#ffc4db", "#cae85f", "#ba1f62", "#60e0da",
];

const g_colorgrad = colorgrad.customGradient(colors);
const g_chroma = chroma.scale(colors);
const g_culori = culori.interpolate(colors);
const g_d3_scale = d3_scale.scaleLinear([0, 0.5, 1], colors);
const g_tinygradient = tinygradient(colors);
const g_color_interpolate = interpolate(colors);
/*
console.log("colorgrad", g_colorgrad.at(0.75).hex());
console.log("chroma", g_chroma(0.75).hex());
console.log("culori", culori.formatHex(g_culori(0.75)));
console.log("d3-scale", g_d3_scale(0.75));
console.log("tinygradient", g_tinygradient.rgbAt(0.75).toHex());
console.log("color-interpolate", g_color_interpolate(0.75));*/

const suite = new benchmark.Suite;

suite
    .add("colorgrad-js", function() {
        g_colorgrad.at(0.75);
    })
    .add("chroma-js", function() {
        g_chroma(0.75);
    })
    .add("culori", function() {
        g_culori(0.75);
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
