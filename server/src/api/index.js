const Router = require('express');
const org = require('./routes/org');

module.exports = () => {
    const app = Router();
    org(app);

    return app;
}