const Joi = require('joi');

const schema = Joi.object({
    depName: Joi.string()
        .required(),
    version: Joi.string()
        .required(),
    scanDate: Joi.date()
        .required(),
    depFileID: Joi.number()
        .required()
});

module.exports = schema;