"use strict";

var R = require('ramda');

function counter() {
    return this.ctx.counter++;
}

function random() {
    return Math.random();
}

exports = {
    counter: counter,
    random: random
};