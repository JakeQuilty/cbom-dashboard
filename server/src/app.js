// Creds: https://github.com/santiq/bulletproof-nodejs/blob/master/src/app.ts
import config from './config';
import express from 'express';
import Logger from './loaders/logger';

async function start(){
    const app = express();
    
    await require('./loaders').default({ expressApp: app });

    app.listen(config.port, () => {
        Logger.info(`Server listening on port: ${config.port}`);
    }).on('error', error => {
        Logger.error(error);
        process.exit(1);
    });
}

start();


// CHANGE THIS TO SERVER.JS WHEN READY TO TEST