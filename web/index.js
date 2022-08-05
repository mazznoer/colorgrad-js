import * as colorgrad from "colorgrad";

let gradient = null;

const width = window.innerWidth;
const height = 70;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const canvas_g = document.createElement('canvas');
const ctx_g = canvas_g.getContext('2d');
canvas_g.width = width;
canvas_g.height = 1;

const colors = document.getElementById('colors');
const position = document.getElementById('position');
const blend = document.getElementById('blend-mode');
const interp = document.getElementById('interpolation-mode');
const sharp = document.getElementById('sharp');
const sharp_segment = document.getElementById('sharp-segment');
const sharp_smoothness = document.getElementById('sharp-smoothness');
const print_setting = document.getElementById('print-settings');
const get_colors = document.getElementById('get-colors');

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
        gradient = colorgrad.customGradient(cols, pos, bld, intp);
        if (shp) {
            gradient = gradient.sharp(shpc, shps);
        }
        if (drawg) {
            draw(gradient);
        } else {
            konsole.log(`colors: [${cols.map(x => `"${x}"`).join(', ')}]\npositions: [${pos.join(', ')}]`.trim());
        }
        print_colors(gradient.colors(get_colors.value));
    } catch (e) {
        konsole.error(e);
        gradient = null;
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

function print_colors(colors) {
    let html = colors
        .map(c => {
            const fg = c.luminance() > 0.3 ? "#000" : "#fff";
            const hex = c.hex();
            return `<span style="background:${hex};color:${fg};">"${hex}"</span>`;
        })
        .join(`, `);
    document.getElementById("colors-out").innerHTML = `[${html}]`;
}

colors.addEventListener('change', () => update());
position.addEventListener('change', () => update());
blend.addEventListener('change', () => update());
interp.addEventListener('change', () => update());
sharp.addEventListener('change', () => update());
sharp_segment.addEventListener('change', () => update());
sharp_smoothness.addEventListener('change', () => update());
print_setting.addEventListener('click', () => update(false));

get_colors.addEventListener('change', (e) => {
    if (gradient == null) {
        return;
    };
    print_colors(gradient.colors(e.target.value));
});

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
