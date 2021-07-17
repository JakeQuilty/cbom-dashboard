const Joi = require('joi');

const schema = Joi.object({
    repoID: Joi.number()
        .required(),
    filePath: Joi.string()
        .required(),
    typeID: Joi.number()
        .required()
});

module.exports = schema;