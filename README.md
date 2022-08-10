# colorgrad-js

[![npm](https://img.shields.io/npm/v/colorgrad-js.svg)](https://www.npmjs.com/package/colorgrad-js)

High-performance Javascript color gradient library powered by [Rust](https://github.com/mazznoer/colorgrad-rs) + WebAssembly.

* No dependencies.
* Faster than [d3-scale](https://www.npmjs.com/package/d3-scale), [chroma-js](https://www.npmjs.com/package/chroma-js), [culori](https://www.npmjs.com/package/culori), [tinygradient](https://www.npmjs.com/package/tinygradient), [color-interpolate](https://www.npmjs.com/package/color-interpolate).
* Blend modes: `rgb`, `linear-rgb`, `hsv`, `oklab`.
* Interpolation modes: `linear`, `catmull-rom`, `basis`.

## [Benchmarks](https://github.com/mazznoer/colorgrad-js/tree/master/examples/bench.js)

```shell
cd examples
npm install
node bench.js
```

**Result**

```
colorgrad-js x 3,948,162 ops/sec ±5.55% (72 runs sampled)
chroma-js x 1,150,657 ops/sec ±1.29% (91 runs sampled)
culori x 1,912,210 ops/sec ±1.93% (88 runs sampled)
d3-scale x 1,858,222 ops/sec ±0.14% (93 runs sampled)
tinygradient x 372,325 ops/sec ±2.13% (92 runs sampled)
color-interpolate x 939,965 ops/sec ±1.15% (92 runs sampled)
Fastest is colorgrad-js
```

## Installation

```shell
npm i colorgrad-js
```

## Usage

### Node.js

```js
import colorgrad from "colorgrad-js";

const grad = colorgrad.customGradient(["#C41189", "#00BFFF", "#FFD700"], null, "oklab", "catmull-rom");

// get the gradient domain min & max
console.log(grad.domain()); // [0, 1]

// get color at 0.75
console.log(grad.at(0.75).rgba8());

// get 100 colors evenly spaced accross gradient domain
console.log(grad.colors(100).map(c => c.hex()));
```

### Bundler

```js
import * as colorgrad from "colorgrad-js/bundler";

const grad = colorgrad.customGradient(["#C41189", "#00BFFF", "#FFD700"], null, "oklab", "catmull-rom");
console.log(grad.at(0.75).rgba8());
console.log(grad.colors(100).map(c => c.hex()));
```

### Browser

```html
<html>
<head>
<script type="module">

import init, {
    customGradient
} from "./node_modules/colorgrad-js/web/colorgrad.js";

async function run() {
    await init();

    const grad = customGradient(["#C41189", "#00BFFF", "#FFD700"], null, "oklab", "catmull-rom");
    console.log(grad.at(0.75).rgba8());
    console.log(grad.colors(100).map(c => c.hex()));
}

run();

</script>
</head>
<body>
</body>
</html>
```

## API

### Custom Gradient

```js
// colorgrad.customGradient(colors, position, blending_mode, interpolation_mode);

const g = colorgrad.customGradient(["deeppink", "gold", "seagreen"]);

const g = colorgrad.customGradient(["deeppink", "gold", "seagreen"], [0, 0.35, 1.0]);

const g = colorgrad.customGradient(["deeppink", "gold", "seagreen"], null, "oklab", "catmull-rom");
```

### Preset Gradients

```js
colorgrad.rainbow()
colorgrad.sinebow()
colorgrad.turbo()
colorgrad.cividis()
colorgrad.cubehelixDefault()
colorgrad.warm()
colorgrad.cool()
```

```js
const g = colorgrad.rainbow();

console.log(g.at(0.5).hex());
```

## Building

Requirements:
+ [Rust](https://www.rust-lang.org/tools/install)
+ [wasm-pack](https://github.com/rustwasm/wasm-pack)

```shell
cd colorgrad-js
wasm-pack build --target nodejs
```

## Similar Projects

* [colorgrad](https://github.com/mazznoer/colorgrad-rs) (Rust)
* [colorgrad](https://github.com/mazznoer/colorgrad) (Go)
* [chroma.js](https://gka.github.io/chroma.js/#color-scales) (Javascript)
* [d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic/) (Javascript)

