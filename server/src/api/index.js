const express = require('express');
const org = require('./routes/org');
const repo = require('./routes/repo')

module.exports = () => {
    const app = express.Router();
    org(app);
    repo(app);

    return app;
}