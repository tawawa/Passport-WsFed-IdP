'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _wsfed = require('wsfed');

var _wsfed2 = _interopRequireDefault(_wsfed);

var _getKeyandCertificates = require('./getKeyandCertificates');

var _getKeyandCertificates2 = _interopRequireDefault(_getKeyandCertificates);

var _UnauthorizedError = require('./UnauthorizedError');

var _UnauthorizedError2 = _interopRequireDefault(_UnauthorizedError);

var _profileMapper = require('./profileMapper');

var _profileMapper2 = _interopRequireDefault(_profileMapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wsfedAsync = {
    // This method is to be called by 
    // the app bootstrap method 
    // it'll setup the options provider
    // which will then be used by the framework
    createOptionsProvider: function createOptionsProvider() {
        return function (req, res, next) {
            var query = req.query;
            var env = process.env;

            if (!wsfedAsync.options) {
                var keys = (0, _getKeyandCertificates2.default)();
                wsfedAsync.options = {
                    getPostURL: function getPostURL(wtrealm, wreply, req, callback) {
                        // Fix arity problem, the getPostURL is called with different
                        // arities in different methods by node-wsfed
                        if (callback === undefined) {
                            callback = wreply;
                        }
                        return callback(null, 'https://' + env['AUTH0_DOMAIN'] + '/login/callback');
                    },

                    // Will only issue tokens for auth0
                    profileMapper: _profileMapper2.default,
                    audience: env['WTREALM'],
                    issuer: env['ISSUER_NAME'],
                    key: keys.private,
                    cert: keys.cert
                };
            }

            req.wsfedOptions = Object.assign({}, wsfedAsync.options, {
                audience: query.wtrealm,
                wctx: query.wctx
            });

            next();
        };
    },


    auth: function auth(req, res, next) {
        return _wsfed2.default.auth(req.wsfedOptions)(req, res, next);
    },

    metadata: function metadata(req, res, next) {
        return _wsfed2.default.metadata(req.wsfedOptions)(req, res, next);
    },

    sendError: function sendError(error, req, res, next) {
        if (_UnauthorizedError2.default.isUnauthorizedError(error)) {
            return _wsfed2.default.sendError(Object.assign({}, req.wsfedOptions, {
                fault: error
            }))(req, res, next);
        }
        if (req.query.wctx) {
            return _wsfed2.default.sendError(Object.assign({}, req.wsfedOptions, {
                fault: new _UnauthorizedError2.default('login_failed', error.message)
            }))(req, res, next);
        }

        next(error);
    }
};
exports.default = wsfedAsync;