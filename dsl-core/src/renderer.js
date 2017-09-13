const R = require('ramda')
const { compile, debugCompile } = require('./compiler')

/**
*
* @param {Object} inject a symbol table
* @param {bool} default is false
* @returns {Function} renderTemplate
*/
function renderer (inject, debug = false) {
  return function (obj) {
    if (debug) {
      console.log('renderer: ', obj)
    }
    const _compile = debug ? debugCompile : compile
    const answer = R.map(function (renderArray) {
      return R.reduce(function (oripattern, item) {
        if (typeof item.pattern === 'string') { return oripattern.replace(item.model, inject[item.pattern.trim()]) } else { return oripattern.replace(item.model, item.pattern) }
      }, R.head(renderArray).oripattern, renderArray)
    }, _compile(obj))

    return R.reduce(function (result, pair) {
      const path = R.split('.', R.head(pair))
      const value = R.last(pair)
      return R.assocPath(path, value, result)
    }, obj, R.toPairs(answer))
  }
}

module.exports = renderer
