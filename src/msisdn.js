import CustomStrategy from 'passport-custom'
import UnauthorizedError from './UnauthorizedError';
import crypto from 'crypto';

function sha256(secret) {
    return crypto.createHmac('sha256', secret)
        .update('I love cupcakes')
        .digest('hex');
}

export default new CustomStrategy(function (req, done) {
    const phoneNumber = req.authParams.login_hint;
    if (phoneNumber && phoneNumber === req.headers['x-msisdn']) {
        // For https://github.com/auth0/node-wsfed/blob/master/lib/claims/PassportProfileMapper.js#L38
        // We should pass a separate profile mapper
        // as we do in wsFedAsync depending on our exact parameters
        return done(null, {
            // We need this.
            id: sha256(phoneNumber),
            phone_number: phoneNumber,
            phone_verified: true,
        });
    }
    
    done(new UnauthorizedError('unauthorized', 'MSISDN could not be validated'));
});