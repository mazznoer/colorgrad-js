#!/usr/bin/env node

const pkg = import("./pkg/colorgrad.js");

pkg
    .then(m => {
        let g = m.custom_gradient(['red', 'gold', 'f0f']);
        console.log(g.domain(), g.at(0.7).hex(), g.at(0.35).rgba(), g.at(0.35).rgba8());

        for (let c of g.colors(6)) {
            console.log(c.hex());
        }
    })
    .catch(console.error);