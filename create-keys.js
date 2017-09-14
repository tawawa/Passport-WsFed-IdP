var selfsigned = require('selfsigned');
var fs = require('fs');

try {
    const configFile = fs.readFileSync('./env.json').toString('utf8');
    const envVariables = JSON.parse(configFile);
    Object.assign(process.env, envVariables);
} catch(e) {
    console.error("Please check the env.json file in the root of the repository");
    console.error(e);
    process.exit(-1);
}


console.log('Generating keys for', process.env.ISSUER_NAME);

if (!process.env.ISSUER_NAME) {
    console.log('Please check .env');
    return;
}

selfsigned.generate([{
    name: 'commonName',
    value: 'Authorization Server'
}, {
    name: 'organizationName',
    value: process.env['ISSUER_NAME']
}], {
    keySize: 2048,
    algorithm: 'sha256',
    days: 30,
}, function (err, keys) {
    console.log (err, keys);
    if (err) {
        return console.error(err);
    }

    console.log('Key generation complete, things to copy to .env file, please use selfsigned for **DEVELOPMENT ONLY**');
    console.log('========================================================================\n\n\n');

    var configValues = {

        'WSFED_PRIVATE_KEY': keys.private,
        'WSFED_PUBLIC_KEY': keys.public,
        'WSFED_CERTIFICATE': keys.cert
    };
    console.log(JSON.stringify(configValues));
    console.log('========================================================================\n\n\n');
});