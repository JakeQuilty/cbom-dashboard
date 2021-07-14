const express = require("express");
const { models } = require('../../models/db');
const OrgService = require('../../services/OrgService');
const GitHubModel = require("../../models/github-api.model");
const DatabaseService = require("../../services/DatabaseService");
const {celebrate, Joi, Segments} = require('celebrate');
const Logger = require('../../loaders/logger')

const route = express.Router();
// typedi.Container.set('OrgService', new OrgService());

module.exports = (app) => {
    app.use('/org', route);

    route.get('/list', (req, res) =>{
        Logger.info("test");
        return res.status(200).json({message: "hi"});
    });

    route.post('/new',
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                userID: Joi.string().required(),
                name: Joi.string().required(),
                ghAuthToken: Joi.string().required()
            }),
        }),
        async (req, res) => {
            Logger.info(`::::: Adding New Org: ${req.body.name} :::::`);
            // Logger.debug('body: %o', req.body); // Uncommenting this will print plaintext GitHub Auth Tokens to the console...

            ghService = new GitHubModel();
            dbService = new DatabaseService(models);
            const reqData = {
                name: req.body.name,
                ghAuthToken: req.body.ghAuthToken,
                userID: req.body.userID
            }

            try {
                let orgService = new OrgService(ghService, dbService);
                const { status, data } = await orgService.CreateNewOrg(reqData);
                return res.status(status).json({ data });
            } catch(error) {
                Logger.error(error);
                return res.status(500);
            }
        });

    route.post('/scan',
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                userID: Joi.string().required(),
                name: Joi.string().required()
            }),
        }),
        async (req, res) => {
            Logger.info(`::::: Scanning Org: ${req.body.name} :::::`);
            Logger.debug('body: %o', req.body);

            ghService = new GitHubModel();
            dbService = new DatabaseService(models);
            const reqData = {
                name: req.body.name,
                userID: req.body.userID
            }

            try {
                let orgService = new OrgService(ghService, dbService);
                const { status, data } = await orgService.ScanOrg(reqData);
                // instead of returning all data at once, just send an OK response and have frontend make more calls to other endpoints to get data?
                return res.status(status).json({data});

            } catch(error) {
                Logger.error(error);
                return res.status(500);
            }
        });
}