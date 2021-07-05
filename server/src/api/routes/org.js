const express = require("express");
// import middlewares from '../middlewares';
const typedi = require("typedi");
const OrgService = require('../../services/OrgService');
const {celebrate, Joi, Segments} = require('celebrate'); // celebrate, Joi
const Logger = require('../../loaders/logger')

const route = express.Router();
typedi.Container.set('OrgService', new OrgService());

module.exports = (app) => {
    app.use('/org', route);

    route.get('/list', (req, res) =>{
        Logger.info("test");
        return res.status(200).json({message: "hi"});
    });

     route.post('/new',celebrate({
        [Segments.BODY]: Joi.object().keys({
            userID: Joi.string().required(),
            name: Joi.string().required(),
            ghAuthToken: Joi.string().required()
        }),
       }),
        async (req, res) => {
            Logger.info(`::::: Adding New Org: ${req.body.name} :::::`);
            Logger.debug('body: %o', req.body);
            const reqData = {
                name: req.body.name,
                ghAuthToken: req.body.ghAuthToken,
                userID: req.body.userID
            }
            try {
                orgService = new OrgService();
                const { status, data } = await orgService.CreateNewOrg(reqData);
                return res.status(status).json({ data });
            } catch (error){
                Logger.error(error);
                return res.status(500);
            }
        });
}