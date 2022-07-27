# colorgrad (js)

[![npm](https://img.shields.io/npm/v/@mazznoer/colorgrad.svg)](https://www.npmjs.com/package/@mazznoer/colorgrad)

## Installation

```shell
npm i @mazznoer/colorgrad
```

## Usage

```js
import * as colorgrad from "@mazznoer/colorgrad";

let gradient = colorgrad.custom_gradient(["#C41189", "#00BFFF", "#FFD700"], null, "oklab");
let hex = gradient.at(0.5).hex();
let [r, g, b, a] = gradient.at(0.7).rgba8();
```

**TODO** add more usage example.
