const express = require('express');
const org = require('./routes/org');

module.exports = () => {
    const app = express.Router();
    org(app);

    return app;
}