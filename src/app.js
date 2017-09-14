import 'babel-polyfill';
import setupExpress from './setupExpress';
import fs from 'fs';

try {
    const configFile = fs.readFileSync('./env.json').toString('utf8');
    const envVariables = JSON.parse(configFile);
    Object.assign(process.env, envVariables);
} catch(e) {
    console.error("Please check the env.json file in the root of the repository");
    console.error(e);
    process.exit(-1);
}

export default setupExpress();