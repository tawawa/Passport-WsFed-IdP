'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _UnauthorizedError = require('./UnauthorizedError');

var _UnauthorizedError2 = _interopRequireDefault(_UnauthorizedError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (req, res, next) {

    req.authParams = req.query;

    _passport2.default.authenticate('msisdn', function (err, user, info) {
        if (user) {
            req.user = user;
            return next();
        }

        if (err) {
            return next(err);
        }

        next(new _UnauthorizedError2.default('login_failed', 'Unexpected, no user or error'));
    })(req, res);
};