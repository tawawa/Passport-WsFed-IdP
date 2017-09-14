import express from 'express';
import logger from 'morgan';
import passport from 'passport';
import wsfedRouter from './routes/wsfed';
import wsfedAsync from './wsfedAsync';
import msisdnauth from './msisdn';
import mockProxy from './mockProxy';

export default function setupExpress() {
    const app = express();
    app.use(logger('dev'));
    
    // Allows this to sit-behind webtask and ngrok
    console.log('Running in', process.env.NODE_ENV || 'production');
    if (process.env['NODE_ENV'] === 'dev') {
        app.set('trust proxy', 'loopback');
        app.set('env', 'development');
        app.use(mockProxy);
    }

    app.use(passport.initialize());
    app.use(wsfedAsync.createOptionsProvider());

    passport.use('msisdn', msisdnauth);


    app.use('/', wsfedRouter);

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