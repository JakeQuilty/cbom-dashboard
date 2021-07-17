const Joi = require('joi');

const schema = Joi.object({
    orgName: Joi.string()
        .required(),
    repoName: Joi.string()
        .required(),
    sha: Joi.string()
        .required(),
    authToken: Joi.string()
        .required()
});

module.exports = schema;