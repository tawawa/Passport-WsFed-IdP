'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _passportCustom = require('passport-custom');

var _passportCustom2 = _interopRequireDefault(_passportCustom);

var _UnauthorizedError = require('./UnauthorizedError');

var _UnauthorizedError2 = _interopRequireDefault(_UnauthorizedError);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha256(secret) {
    return _crypto2.default.createHmac('sha256', secret).update('I love cupcakes').digest('hex');
}

exports.default = new _passportCustom2.default(function (req, done) {
    var phoneNumber = req.authParams.login_hint;
    if (phoneNumber && phoneNumber === req.headers['x-msisdn']) {
        // For https://github.com/auth0/node-wsfed/blob/master/lib/claims/PassportProfileMapper.js#L38
        // We should pass a separate profile mapper
        // as we do in wsFedAsync depending on our exact parameters
        return done(null, {
            // We need this.
            id: sha256(phoneNumber),
            phone_number: phoneNumber,
            phone_verified: true
        });
    }

    done(new _UnauthorizedError2.default('unauthorized', 'MSISDN could not be validated'));
});