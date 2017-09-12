'use strict'

function counter () {
  return this.ctx.counter++
}

function random () {
  return Math.random()
}

exports = {
  counter,
  random
}
