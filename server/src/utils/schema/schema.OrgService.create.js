const Joi = require('joi');
// orgName, authToken, userID, ghID
const schema = Joi.object({
    orgName: Joi.string()
        .required(),
    
    userID: Joi.number()
        .required(),

    authToken: Joi.string()
        .required(),

    ghID: Joi.number()
        .required()
});

module.exports = schema;