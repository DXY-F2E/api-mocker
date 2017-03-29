'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _compiler = require('./compiler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* 
* @param {Object} inject a symbol table
* @param {bool} default is false
* @returns {Function} renderTemplate
*/
function renderer(inject) {
    var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    return function (obj) {
        if (debug) {
            console.log('renderer: ', obj);
        }
        var _compile = debug ? _compiler.debugCompile : _compiler.compile;
        var answer = _ramda2.default.map(function (renderArray) {
            return _ramda2.default.reduce(function (oripattern, item) {
                if (typeof item.pattern === 'string') return oripattern.replace(item.model, inject[item.pattern.trim()]);else return oripattern.replace(item.model, item.pattern);
            }, _ramda2.default.head(renderArray).oripattern, renderArray);
        }, _compile(obj));

        return _ramda2.default.reduce(function (result, pair) {
            var path = _ramda2.default.split('.', _ramda2.default.head(pair));
            var value = _ramda2.default.last(pair);
            return _ramda2.default.assocPath(path, value, result);
        }, obj, _ramda2.default.toPairs(answer));
    };
}

exports.default = renderer;