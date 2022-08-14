export class Konsole {
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

// trim whitespace, single quote, double quote
function trim(s) {
    return s.replace(/(^['"\s]*|['"\s]*$)/g, "");
}

export function splitColors(str) {
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

export function parsePos(str) {
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