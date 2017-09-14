'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = setupExpress;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _wsfed = require('./routes/wsfed');

var _wsfed2 = _interopRequireDefault(_wsfed);

var _wsfedAsync = require('./wsfedAsync');

var _wsfedAsync2 = _interopRequireDefault(_wsfedAsync);

var _msisdn = require('./msisdn');

var _msisdn2 = _interopRequireDefault(_msisdn);

var _mockProxy = require('./mockProxy');

var _mockProxy2 = _interopRequireDefault(_mockProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupExpress() {
    var app = (0, _express2.default)();
    app.use((0, _morgan2.default)('dev'));

    // Allows this to sit-behind webtask and ngrok
    console.log('Running in', process.env.NODE_ENV || 'production');
    if (process.env['NODE_ENV'] === 'dev') {
        app.set('trust proxy', 'loopback');
        app.set('env', 'development');
        app.use(_mockProxy2.default);
    }

    app.use(_passport2.default.initialize());
    app.use(_wsfedAsync2.default.createOptionsProvider());

    _passport2.default.use('msisdn', _msisdn2.default);

    app.use('/', _wsfed2.default);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
        // render the error page
        if (process.env.NODE_ENV === 'dev') {
            console.log(err);
            res.status(err.status || 500);
            return res.json(err);
        }
        return res.status(err.status || 500).end('Internal server error');
    });

    return app;
}