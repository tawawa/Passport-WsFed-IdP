"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getKeyandCertificates;
function getKeyandCertificates() {
    var env = process.env;
    return {
        private: env.WSFED_PRIVATE_KEY,
        public: env.WSFED_PUBLIC_KEY,
        cert: env.WSFED_CERTIFICATE
    };
}