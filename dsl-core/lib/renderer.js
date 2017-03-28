'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _compiler = require('./compiler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderer(inject) {
    var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    return function (obj) {
        if (debug) {
            console.log('renderer: ', obj);
        }
        var compile = debug ? _compiler.debugCompile : compile;
        var answer = _ramda2.default.map(function (renderArray) {
            return _ramda2.default.reduce(function (oripattern, item) {
                if (typeof item.pattern === 'string') return oripattern.replace(item.model, inject[item.pattern]);else return oripattern.replace(item.model, item.pattern);
            }, _ramda2.default.head(renderArray).oripattern, renderArray);
        }, compile(obj));

        return _ramda2.default.reduce(function (result, pair) {
            var path = _ramda2.default.split('.', _ramda2.default.head(pair));
            var value = _ramda2.default.last(pair);
            return _ramda2.default.assocPath(path, value, result);
        }, obj, _ramda2.default.toPairs(answer));
    };
}

console.log(renderer({ id: 'wo' }, true)({
    one: '${id}world'
}));
exports.default = renderer;