// Creds: https://github.com/santiq/bulletproof-nodejs/blob/master/src/loaders/express.ts
const express = require('express');
const bodyParser = require("body-parser");
const routes = require('../api');
const config = require('../config');
const path = require('path');

const celebrate = require('celebrate');
const Logger = require('./logger');
const { error } = require('winston');

module.exports = (app) => {
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '../../app/build')));
    app.use(config.api.prefix, routes());
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });
    app.use((err, req, res, next) => {
        if (celebrate.isCelebrateError(err)) {
            Logger.debug("celebrate error:\n", err);
        }
        res.status(err.status || 500);
        res.json({
            errors: {
            message: err.message,
            },
        });
    });

}