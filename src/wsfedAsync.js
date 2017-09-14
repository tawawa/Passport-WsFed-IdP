import wsfed from 'wsfed';
import getKeyandCertificates from './getKeyandCertificates';
import UnauthorizedError from './UnauthorizedError';
import profileMapper from './profileMapper';

const wsfedAsync = {
    // This method is to be called by 
    // the app bootstrap method 
    // it'll setup the options provider
    // which will then be used by the framework
    createOptionsProvider() {
        return (req, res, next) => {
            const query = req.query;
            const env = process.env;

            if (!wsfedAsync.options) {
                const keys = getKeyandCertificates();
                wsfedAsync.options = {
                    getPostURL(wtrealm, wreply, req, callback) {
                        // Fix arity problem, the getPostURL is called with different
                        // arities in different methods by node-wsfed
                        if (callback === undefined) {
                            callback = wreply;
                        }
                        return callback(null, `https://${env['AUTH0_DOMAIN']}/login/callback`);
                    },
                    // Will only issue tokens for auth0
                    profileMapper: profileMapper,
                    audience: env['WTREALM'],
                    issuer: env['ISSUER_NAME'],
                    key: keys.private,
                    cert: keys.cert,
                };
            }

            req.wsfedOptions = Object.assign({}, wsfedAsync.options, {
                audience: query.wtrealm,
                wctx: query.wctx
            });

            next();
        }
    },

    auth: (req, res, next) => wsfed.auth(req.wsfedOptions)(req, res, next),
    
    metadata: (req, res, next) => wsfed.metadata(req.wsfedOptions)(req, res, next),

    sendError(error, req, res, next) {
        if (UnauthorizedError.isUnauthorizedError(error)) {
            return wsfed.sendError(Object.assign({}, req.wsfedOptions, {
                fault: error
            }))(req, res, next);
        } 
        if (req.query.wctx) {
            return wsfed.sendError(Object.assign({}, req.wsfedOptions, {
                fault: new UnauthorizedError('login_failed', error.message),
            }))(req, res, next);    
        }

        next(error);
    }
};
export default wsfedAsync;
