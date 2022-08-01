import * as colorgrad from "colorgrad";

let width = window.innerWidth;
let height = 70;

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let canvas_g = document.createElement('canvas');
let ctx_g = canvas_g.getContext('2d');
canvas_g.width = width;
canvas_g.height = 1;

let colors = document.getElementById('colors');
let position = document.getElementById('position');
let blend = document.getElementById('blend-mode');
let interp = document.getElementById('interpolation-mode');
let sharp = document.getElementById('sharp');
let sharp_segment = document.getElementById('sharp-segment');
let sharp_smoothness = document.getElementById('sharp-smoothness');
let print_setting = document.getElementById('print-settings');

class Konsole {
    constructor(el) {
        this.el = el;
    }

    clear() {
        this.el.innerHTML = '';
    }

    log(msg) {
        this.el.innerHTML = msg;
    }

    error(msg) {
        this.el.innerHTML = `<span class='error'>${msg}</span>`;
    }
}

const konsole = new Konsole(document.getElementById('output'));

update();

function update(drawg = true) {
    konsole.clear();

    let cols = splitColors(colors.value);
    let pos = parsePos(position.value);
    let bld = blend.value;
    let intp = interp.value;
    let shp = sharp.checked;
    let shpc = sharp_segment.value;
    let shps = sharp_smoothness.value;

    try {
        let grad = colorgrad.customGradient(cols, pos, bld, intp);
        if (shp) {
            grad = grad.sharp(shpc, shps);
        }
        if (drawg) {
            draw(grad);
        } else {
            konsole.log(`colors: [${cols.map(x => `"${x}"`).join(', ')}]\npositions: [${pos.join(', ')}]`.trim());
        }
    } catch (e) {
        konsole.error(e);
    }
}

function draw(grad) {
    let imageData = ctx_g.getImageData(0, 0, canvasWidth, canvasHeight);
    let buf = new ArrayBuffer(imageData.data.length);
    let buf8 = new Uint8ClampedArray(buf);
    let data = new Uint32Array(buf);

    /*for (let y = 0; y < canvasHeight; ++y) {
        for (let x = 0; x < canvasWidth; ++x) {
            let [r, g, b, a] = grad.at(x / canvasWidth).rgba8();
            data[y * canvasWidth + x] = (a << 24) | (b << 16) | (g << 8) | r;
        }
    }*/

    for (let x = 0; x < canvasWidth; ++x) {
        let [r, g, b, a] = grad.at(x / canvasWidth).rgba8();
        data[x] = (a << 24) | (b << 16) | (g << 8) | r;
    }

    imageData.data.set(buf8);
    ctx_g.putImageData(imageData, 0, 0);

    ctx.globalCompositeOperation = 'copy';
    ctx.fillStyle = ctx.createPattern(canvas_g, 'repeat-y');
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

colors.addEventListener('change', () => update());
position.addEventListener('change', () => update());
blend.addEventListener('change', () => update());
interp.addEventListener('change', () => update());
sharp.addEventListener('change', () => update());
sharp_segment.addEventListener('change', () => update());
sharp_smoothness.addEventListener('change', () => update());
print_setting.addEventListener('click', () => update(false));

// trim whitespace, single quote, double quote
function trim(s) {
    return s.replace(/(^['"\s]*|['"\s]*$)/g, "");
}

function splitColors(str) {
    let colors = [];
    // Regex taken from https://stackoverflow.com/a/53774647
    for (let x of str.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)) {
        let s = trim(x);
        if (s == '') {
            continue;
        }
        colors.push(s);
    }
    return colors;
}

function parsePos(str) {
    let pos = [];
    for (let x of str.split(',')) {
        let s = x.trim();
        if (s == '') {
            continue;
        }
        pos.push(parseFloat(s));
    }
    return pos;
}