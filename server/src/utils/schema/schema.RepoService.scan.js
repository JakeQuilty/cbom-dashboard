const Joi = require('joi');

const schema = Joi.object({
    repoName: Joi.string()
        .required(),
    
    orgID: Joi.number()
        .required(),

    defaultBranch: Joi.string()
        .required()
});

module.exports = schema;