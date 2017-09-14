'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('babel-polyfill');

var _setupExpress = require('./setupExpress');

var _setupExpress2 = _interopRequireDefault(_setupExpress);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

try {
    var configFile = _fs2.default.readFileSync('./env.json').toString('utf8');
    var envVariables = JSON.parse(configFile);
    Object.assign(process.env, envVariables);
} catch (e) {
    console.error("Please check the env.json file in the root of the repository");
    console.error(e);
    process.exit(-1);
}

exports.default = (0, _setupExpress2.default)();