const ngrok = require('ngrok');

ngrok.connect({
    proto: 'http',
    port: 8080
}, function (err, url){
    // Cheap and dirty way to avoid spam, I should probably use gulp for all this but 
    // I am lazy.
    setTimeout(function () {
        if (err) {
            console.error('Failed to create NGROK tunnel reason', err);
        }

        console.log('Tunnel created, you can now use the following in Auth0', url);
    }, 2000);
});