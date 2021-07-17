const Joi = require('joi');

const schema = Joi.object({
    repoName: Joi.string()
        .required(),
    
    orgName: Joi.string()
        .required(),

    defaultBranch: Joi.string()
        .required(),
    authToken: Joi.string()
        .required()
});

module.exports = schema;