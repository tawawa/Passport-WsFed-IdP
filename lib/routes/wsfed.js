'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passportMiddleware = require('../passportMiddleware');

var _passportMiddleware2 = _interopRequireDefault(_passportMiddleware);

var _wsfedAsync = require('../wsfedAsync');

var _wsfedAsync2 = _interopRequireDefault(_wsfedAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

router.get('/FederationMetadata/2007-06/FederationMetadata.xml', _wsfedAsync2.default.metadata);
router.get('/', _passportMiddleware2.default, _wsfedAsync2.default.auth);
router.use(_wsfedAsync2.default.sendError);

exports.default = router;