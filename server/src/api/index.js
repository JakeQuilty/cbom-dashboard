const express = require('express');
const org = require('./routes/org');
const repo = require('./routes/repo');
const dep = require('./routes/dep');

module.exports = () => {
    const app = express.Router();
    org(app);
    repo(app);
    dep(app);

    return app;
}