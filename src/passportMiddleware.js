import passport from 'passport';
import UnauthorizedError from './UnauthorizedError';

export default (req, res, next) => {

    req.authParams = req.query;
    
    passport.authenticate('msisdn', function (err, user, info) {
        if (user) {
            req.user = user;
            return next();
        }
        
        if (err) {
            return next (err);
        }

        next(new UnauthorizedError('login_failed', 'Unexpected, no user or error'));
    })(req, res);
}