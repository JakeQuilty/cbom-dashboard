// Creds: https://github.com/santiq/bulletproof-nodejs/blob/master/src/app.ts
const config = require('./config');
const express = require ('express');
const Logger = require('./loaders/logger');

async function start(){
    const app = express();
    
    await require('./loaders')(app);

    app.listen(config.port, () => {
        Logger.info(`Server listening on port: ${config.port}`);
    }).on('error', error => {
        Logger.error(error);
        process.exit(1);
    });
}

start();