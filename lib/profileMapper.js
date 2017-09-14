'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fm = {
    'nameIdentifier': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
    'phoneNumber': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/phonenumber',
    'phoneVerified': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/phoneverified'
};

var claimsOffered = [{
    id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/phonenumber",
    optional: false,
    displayName: 'Phone Number',
    description: 'The given number of the user'
}, {
    id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/phoneverified",
    optional: false,
    displayName: 'Phone Number Verified',
    description: 'Is phone number verified for the user'
}, {
    id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    optional: true,
    displayName: 'Name ID',
    description: 'The SAML name identifier of the user'
}];

var ProfileMapper = function () {
    function ProfileMapper(pu) {
        _classCallCheck(this, ProfileMapper);

        this._pu = pu;
    }

    _createClass(ProfileMapper, [{
        key: 'getClaims',
        value: function getClaims() {
            var claims = {};

            claims[fm.nameIdentifier] = this._pu.id;

            claims[fm.phoneNumber] = this._pu.phoneNumber;
            claims[fm.phoneVerified] = this._pu.phoneVerified;

            return claims;
        }
    }, {
        key: 'getNameIdentifier',
        value: function getNameIdentifier() {
            var claims = this.getClaims();

            return {
                nameIdentifier: claims[fm.nameIdentifier]
            };
        }
    }]);

    return ProfileMapper;
}();

// /metadata endpoint expects metadata be defined on .prototype
// /auth expects this to be a function
// The only solution for clean code. 


function ExposedProfileMapper() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(ProfileMapper, [null].concat(args)))();
}

ExposedProfileMapper.prototype.metadata = claimsOffered;

exports.default = ExposedProfileMapper;