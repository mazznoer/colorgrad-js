# colorgrad (js)

[![npm](https://img.shields.io/npm/v/@mazznoer/colorgrad.svg)](https://www.npmjs.com/package/@mazznoer/colorgrad)

High performance color gradient library powered by [Rust](https://github.com/mazznoer/colorgrad-rs).

* No dependencies.
* Blazing fast.
* Blend modes: `rgb`, `linear-rgb`, `hsv`, `oklab`.
* Interpolation modes: `linear`, `catmull-rom`, `basis`.

## [Benchmarks](https://github.com/mazznoer/colorgrad-js/tree/master/examples/bench.js)

```shell
cd examples
npm install
node bench.js
```

```
@mazznoer/colorgrad x 3,533,086 ops/sec ±18.43% (56 runs sampled)
chroma-js x 1,225,412 ops/sec ±1.18% (88 runs sampled)
tinygradient x 361,808 ops/sec ±8.67% (82 runs sampled)
color-interpolate x 969,589 ops/sec ±0.53% (85 runs sampled)
Fastest is @mazznoer/colorgrad
```

## Installation

```shell
npm i @mazznoer/colorgrad
```

## Usage

```js
import colorgrad from "@mazznoer/colorgrad";

let gradient = colorgrad.custom_gradient(["#C41189", "#00BFFF", "#FFD700"], null, "oklab", "linear");

// get the gradient domain min & max
console.log(gradient.domain()); // [0, 1]

// get single color at position 0.5
let hex = gradient.at(0.5).hex();

// get single color at position 0.75
let [r, g, b, a] = gradient.at(0.75).rgba8();

// get 100 colors evenly spaced along gradient
let colors = gradient.colors(100);

for (let c of colors) {
    console.log(c.hex());
}
```

## API

### Custom Gradient

```js
// colorgrad.custom_gradient(colors, position, blending_mode, interpolation_mode);

let g = colorgrad.custom_gradient(["deeppink", "gold", "seagreen"]);

let g = colorgrad.custom_gradient(["deeppink", "gold", "seagreen"], [0, 0.35, 1.0]);

let g = colorgrad.custom_gradient(["deeppink", "gold", "seagreen"], null, "oklab", "catmull-rom");
```

### Preset Gradients

```js
let g = colorgrad.rainbow();

console.log(g.at(0.5).hex());
```

## Similar Projects

* [colorgrad](https://github.com/mazznoer/colorgrad) (Rust)
* [colorgrad](https://github.com/mazznoer/colorgrad) (Go)
* [chroma.js](https://gka.github.io/chroma.js/#color-scales) (Javascript)
* [d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic/) (Javascript)

