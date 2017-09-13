const R = require('ramda')
const tree = require('treehugger-node/tree')
const SHADOW_PATTERN = /\$\{[^{}]*\}/g

const mapKey = R.curry((fn, obj) => {
  return R.reduce(function (result, item) {
    const key = R.head(item)
    const value = R.last(item)
    result[fn(key)] = value
    return result
  }, {}, R.toPairs(obj))
})

// 将对象进行预着色
const _shadow = R.curry((originObj, debug) => {
  debug = debug || false
  // path: value
  // example: {'a.b.c': '0'}

  const lastType = R.compose(R.type, R.last)

  if (debug) {
    console.log('prepro shadow: ', originObj)
  }
  if (!originObj) { return {} }

  return R.compose(
    R.filter(R.identity),
    R.map(R.cond([
      [R.compose(R.equals('Object'), lastType), R.converge(R.pair, [R.head, R.compose(_shadow(R.__, debug), R.last)])],
      [R.compose(R.test(SHADOW_PATTERN), R.last), R.identity],
      [R.T, R.always(null)]])),
    R.toPairs
  )(originObj) || []
})

// 先决条件为对对象进行预着色
const shadow = R.curry((preproshadow, debug) => {
  debug = debug || false
  if (debug) {
    console.log('shadow: ', preproshadow)
  }

  return R.reduce(function (result, item) {
    const path = R.head(item)
    const value = R.last(item)

    if (Array.isArray(value)) {
      // shadow(value)
      result = R.merge(result, R.compose(mapKey(key => R.join('.', [path, key])), shadow(R.__, debug))(value))
    } else { result[path] = value }

    return result
  }, {})(preproshadow)
})

const buildGrammarTree = (shadow) => {
  // shadow: "${counter()} world"
  return R.map(value => {
    return value.match(SHADOW_PATTERN).map(function (model) {
      const str = model.slice(2, -1)
      return {
        shadow: shadow,
        model: model,
        oripattern: value,
        pattern: str,
        node: tree.parse(str)
      }
    })
  }, shadow)
}

const debugCompile = R.compose(buildGrammarTree, shadow(R.__, true), _shadow(R.__, true))
const compile = R.compose(buildGrammarTree, shadow(R.__, false), _shadow(R.__, false))

module.exports = {
  compile,
  debugCompile,
  shadow,
  _shadow,
  buildGrammarTree
}
