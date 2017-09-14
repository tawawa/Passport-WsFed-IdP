# Passport-WsFed IdP

![Imgur](http://i.imgur.com/ENPFOYp.gif?1)
This project provides a simple interface for creating a simple nodejs idp using wsfed, it uses the passport-custom strategy and exposes it as a wsfed server, which can be used to create proof of concepts, examples, and or implement weird authentication strategies using passport and expose them as WsFED to Auth0 Server. As of now it works only and only with Auth0 Server. 

## API 

The compiler accepts the following parameters in an object returned by calling the function initially 

- **strategy**: A valid Passport Strategy which can then be used to authenticate the user.
- **serializeUser(user, done)**: [Optional] This will be passed as is to passport.serializeUser
- **deserializeUser(user, done)**: [Optional] This will be passed as is to passport.deserializeUser
- **loginRouteHandler(req, res, next)**: [Optional] This will be passed to the route handler for `GET /login` if this is set the passport.authenticate will be called on `GET & POST /login` this can therefore used to implement more custom authentication flows. 

You can skip passing the extra options and just pass the Passport strategy directly to the authorizer.


## Examples

### Steam OPENID

```javascript
const SteamStrategy = require('passport-steam');

module.exports = function (config, database) {    
    return new new SteamStrategy({
        returnURL: config('SELF_URL'),
        realm: config('STEAM_REALM'),
        apiKey: config('STEAM_KEY')
    }, function (identifier, profile, done) {
        profile.id = identifier;
        done(profile);
    });
}
```

### Full blown


@Todo: Add more stuff here

## Meta stuff

### Why WSFED?

- Because its a single transaction.
- Because its easy and all we care about is authentication here, no authorization or anything.

### Why passport strategies? 

- They are extensible and a good standard.
- There are 368 already, chances are you already are using one.

### Why Auth0? 

- Auth0 does a lot more than just authentication, this allows Auth0 to focus on Rules etc.
- Allows quick building POCs

### Why Webtask?

- Simple. 
- Very fast iteration process.
- Takes care of provisioning and everything else
- Your auth is all matters to you.


### How it works ?

You just write a simple webtask, which is as the following 

```javascript
const CustomStrategy = require('passport-custom');

module.exports = function (config) {

    return new CustomStrategy(function (req, done) {
    
        if (req.query.login_hint === config('secret_sauce')) {
            return done({
                user_id: req.query.login_hint
            });
        }
        
        const error = new Error();
        error.code = 'login_failed';
        error.description = 'You did not know the secret';

        done(error);
    });
}
```

This compiler also expects the following environment variables, you can set them locally by creating dev.env or in cloud using the Webtask's Secrets API

```env
SESSION_SECRET=A random string as secret for storing sessions
AUTH0_DOMAIN=The Auth0 domain that will be called back after authenticating
ISSUER_NAME=The issuer this instance will name itself as.
NODE_ENV=Only set it locally to "dev"
```

#### Localhosting ;)

Just run 
```
# first time only
$ npm install 
# Subsquently
$ npm run dev
... Redacted log ...

Tunnel created, you can now use the following in Auth0 https://[random chars].ngrok.io
Your webtask is now listening for IPv4 traffic on 127.0.0.1:8080
... Redacted Log
```

Use the https://[random chars].ngrok.io as the WSFed URL wherever you are testing this, like the Auth0 Dashboard, and you can run this locally and test it against the Auth0 instance.

