'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildGrammarTree = exports._shadow = exports.shadow = exports.debugCompile = exports.compile = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _treehuggerNode = require('treehugger-node');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SHADOW_PATTERN = /\$\{[^\{\}]*\}/g;

var mapKey = _ramda2.default.curry(function (fn, obj) {
    return _ramda2.default.reduce(function (result, item) {
        var key = _ramda2.default.head(item);
        var value = _ramda2.default.last(item);
        result[fn(key)] = value;
        return result;
    }, {}, _ramda2.default.toPairs(obj));
});

// 将对象进行预着色
var _shadow = _ramda2.default.curry(function (originObj, debug) {
    debug = debug || false;
    // path: value
    // example: {'a.b.c': '0'}

    var lastType = _ramda2.default.compose(_ramda2.default.type, _ramda2.default.last);

    if (debug) {
        console.log('prepro shadow: ', originObj);
    }
    if (!originObj) return {};

    return _ramda2.default.compose(_ramda2.default.filter(_ramda2.default.identity), _ramda2.default.map(_ramda2.default.cond([[_ramda2.default.compose(_ramda2.default.equals('Object'), lastType), _ramda2.default.converge(_ramda2.default.pair, [_ramda2.default.head, _ramda2.default.compose(_shadow(_ramda2.default.__, debug), _ramda2.default.last)])], [_ramda2.default.compose(_ramda2.default.test(SHADOW_PATTERN), _ramda2.default.last), _ramda2.default.identity], [_ramda2.default.T, _ramda2.default.always(null)]])), _ramda2.default.toPairs)(originObj) || [];
});

// 先决条件为对对象进行预着色
var shadow = _ramda2.default.curry(function (preproshadow, debug) {
    debug = debug || false;
    if (debug) {
        console.log('shadow: ', preproshadow);
    }

    return _ramda2.default.reduce(function (result, item) {
        var path = _ramda2.default.head(item);
        var value = _ramda2.default.last(item);

        if (Array.isArray(value)) {
            // shadow(value)
            result = _ramda2.default.merge(result, _ramda2.default.compose(mapKey(function (key) {
                return _ramda2.default.join('.', [path, key]);
            }), shadow(_ramda2.default.__, debug))(value));
        } else result[path] = value;

        return result;
    }, {})(preproshadow);
});

var buildGrammarTree = function buildGrammarTree(shadow) {
    // shadow: "${counter()} world"
    return _ramda2.default.map(function (value) {
        return value.match(SHADOW_PATTERN).map(function (model) {
            var str = model.slice(2, -1);
            return {
                shadow: shadow,
                model: model,
                oripattern: value,
                pattern: str,
                node: _treehuggerNode.tree.parse(str)
            };
        });
    }, shadow);
};

var debugCompile = _ramda2.default.compose(buildGrammarTree, shadow(_ramda2.default.__, true), _shadow(_ramda2.default.__, true));
var compile = _ramda2.default.compose(buildGrammarTree, shadow(_ramda2.default.__, false), _shadow(_ramda2.default.__, false));

exports.compile = compile;
exports.debugCompile = debugCompile;
exports.shadow = shadow;
exports._shadow = _shadow;
exports.buildGrammarTree = buildGrammarTree;