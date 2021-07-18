const express = require("express");
const { models } = require('../../db');
const config = require("../../config");
const {celebrate, Joi, Segments} = require('celebrate');
const Logger = require('../../loaders/logger');
const { errorHandler } = require('../errorHandler');
const OrgService = require('../../services/OrgService');
const GitHubService = require("../../services/GitHubService");
const RepoService = require("../../services/RepoService");
const DepedencyFileService = require('../../services/DependencyFileService');
const FileTypeService = require('../../services/FileTypeService');
const DependencyService = require('../../services/DependencyService');

const route = express.Router();

// MAYBE MAKE LIKE AN APISERVICE TO HANDLE THE LOGIC THATS GETTING PUSHED OUT TO HERE?

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
                authToken: Joi.string().required()
            }),
        }),
        async (req, res) => {
            Logger.info(`::::: Adding New Org: ${req.body.name} :::::`);
            // Logger.debug('body: %o', req.body); // Uncommenting this will print plaintext GitHub Auth Tokens to the console...
            
            // instantiate services
            // https://www.npmjs.com/package/typedi ??
            const ghService = new GitHubService();
            const ftService = new FileTypeService(models);
            const dpService = new DependencyService(models);
            const dfService = new DepedencyFileService(ghService, models, dpService);
            const repoService = new RepoService(ghService, models, dfService, ftService); 
            const orgService = new OrgService(ghService, models, repoService);

            try {
                // make sure token and org are valid
                if (!await ghService.validateToken(req.body.authToken)){
                    Logger.error("/api/org/new failed: ", config.ERROR_MESSAGES.invalid_token);
                    throw new Error(config.ERROR_MESSAGES.invalid_token);
                }
                if (!await orgService.validateOrg(req.body.name, req.body.authToken)){
                    Logger.error("/api/org/new failed: ", config.ERROR_MESSAGES.invalid_org);
                    throw new Error(config.ERROR_MESSAGES.invalid_org);
                }

                const ghID = await orgService.getGithubID(req.body.name, req.body.authToken);

                const org = await orgService.create({
                    orgName: req.body.name,
                    authToken: req.body.authToken,
                    userID: req.body.userID,
                    ghID: ghID
                });

                return res.status(200).json({
                    name: org[config.dbTables.organization.org_name],
                    id: org[config.dbTables.organization.org_id]
                });

            } catch(error) {
                Logger.error(error);
                const {status, data} = errorHandler(error);
                return res.status(status).json({data});
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

            // https://www.npmjs.com/package/typedi ??
            const ghService = new GitHubService();
            const ftService = new FileTypeService(models);
            const dpService = new DependencyService(models);
            const dfService = new DepedencyFileService(ghService, models, dpService);
            const repoService = new RepoService(ghService, models, dfService, ftService); 
            const orgService = new OrgService(ghService, models, repoService);

            try {
                //get org data from db
                let org = await orgService.retrieve(req.body.name, req.body.userID);

                // make sure token and org are still valid
                if (!await ghService.validateToken(org[config.dbTables.organization.auth_token])){
                    Logger.error("/api/org/scan failed: ", config.ERROR_MESSAGES.invalid_token);
                    throw new Error(config.ERROR_MESSAGES.invalid_token);
                }
                if (!await orgService.validateOrg(req.body.name, org[config.dbTables.organization.auth_token])){
                    Logger.error("/api/org/scan failed: ", config.ERROR_MESSAGES.invalid_org);
                    throw new Error(config.ERROR_MESSAGES.invalid_org);
                }

                // get list of org's repos
                let repos = await orgService.getRepoList(
                    org[config.dbTables.organization.org_name],
                    org[config.dbTables.organization.auth_token]
                );

                // scan
                const scan = await orgService.scan({
                    orgID: org[config.dbTables.organization.org_id],
                    orgName: org[config.dbTables.organization.org_name],
                    userID: org[config.dbTables.organization.user_id],
                    authToken: org[config.dbTables.organization.auth_token],
                    repoList: repos
                });

                return res.status(200).json({
                    name: scan.orgName,
                    failures: scan.failures
                });

            } catch(error) {
                Logger.error("/api/org/scan failed: ", error);
                const {status, data} = errorHandler(error);
                return res.status(status).json(data);
            }
        });
    
    route.post('/update/ghtoken', 
        //celebrate
        ),
        async (req, res) => {
            Logger.info(`::::: Updating OAuth Token Org: ${req.body.name} :::::`);
            Logger.debug('body: %o', req.body);

            return res.status(200);
        }
}