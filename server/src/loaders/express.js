const express = require('express');
const bodyParser = require("body-parser");
const routes = require('../api');
const config = require('../config');
const path = require('path');

module.exports = (app) => {
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '../../app/build')));
    app.use(routes());
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            errors: {
            message: err.message,
            },
        });
    });

}