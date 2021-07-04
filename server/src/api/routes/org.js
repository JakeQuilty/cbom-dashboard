const express = require("express");
// import middlewares from '../middlewares';
const typedi = require("typedi");
const OrgService = require('../../services/OrgService');
const celebrate = require('celebrate'); // celebrate, Joi
const Logger = require('../../loaders/logger')

const route = express.Router();

module.exports = (app) => {
    app.use('/api/org', route);

    route.get('/list', (req, res) =>{
        Logger.info("test");
        return res.status(200).json({message: "hi"});
    });

    app.post('/new',
        celebrate.celebrate({
            body: celebrate.Joi.object({
                name: celebrate.Joi.string().required(),
                ghAuthToken: celebrate.Joi.string().required(),
                userID: celebrate.Joi.string().required(),
            }),
        }),
        async (req, res) => {
            Logger.debug('Creating new org\nbody: %o', req.body);
            const reqData = {
                name: req.body.name,
                ghAuthToken: req.body.ghAuthToken,
                userID: req.body.userID
            }
            try {
                orgServiceInstance = typedi.Container.get(OrgService);
                const { status, data } = await orgServiceInstance.CreateNewOrg(reqData);
                return res.status(status).json({ data });
            } catch (error){
                logger.error(error);
                return res.status(500);
            }
        });
}