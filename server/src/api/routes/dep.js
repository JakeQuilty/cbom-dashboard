const express = require("express");
const { models } = require('../../db');
const config = require("../../config");
const {celebrate, Joi, Segments} = require('celebrate');
const Logger = require('../../loaders/logger');
const { errorHandler } = require('../errorHandler');
const { base64enc } = require('../../utils/crypto.util');
const RepoService = require("../../services/RepoService");
const DependencyFileService = require("../../services/DependencyFileService");
const DependencyService = require("../../services/DependencyService");
const OrgService = require("../../services/OrgService");
const { format } = require("../../loaders/logger");

const route = express.Router();

const dbRows = {
    repo_id: [config.dbTables.repository.repo_id],
    repo_name: [config.dbTables.repository.repo_name],
    default_branch: [config.dbTables.repository.default_branch],

    dep_id: [config.dbTables.dependency.dep_id],
    dep_name: [config.dbTables.dependency.dep_name],
    dep_version: [config.dbTables.dependency.dep_version],
    depfile_id: [config.dbTables.dependency.depfile_id],

    depfile_path: [config.dbTables.dependencyFile.file_path]
}

module.exports = (app) => {
    app.use('/dep', route);

    route.post('/list', celebrate({
        [Segments.BODY]: Joi.object().keys({
            userID: Joi.number().required(),
            orgID: Joi.number().required()
        }),
    }),
    async (req, res) => {
        try {

            const orgService = new OrgService(null,null,null);
            const depService = new DependencyService(null);

            const depList = await orgService.listDeps({
                orgID: req.body.orgID
            });

            let formattedDepList = []
            for (const [index, dep] of depList.entries()) {
                let repos = await depService.listRepos({depName: dep[dbRows.dep_name], orgID: req.body.orgID});
                // using the index of the dependencies as the frontend id, because this cuts out
                // duplicates so we can't use the db ids anymore
                formattedDepList.push({id: index, name: dep[dbRows.dep_name], numRepos: repos.length});
            }

            let numDeps = formattedDepList.length

            return res.status(200).json({deps: formattedDepList, numDeps: numDeps});
        } catch (error) {
            Logger.error(error);
            const errRes = await errorHandler(error);
            return res.status(errRes.status).json({error: errRes.error});
        }
    });

    // a thing I am worried about for most of the endpoints that takes an orgID is that there is
    // no verification that that org belongs to the user. Right now there is only one user, and 
    // in the future when I add more users, I will setup a different auth scenario, so I don't want to
    // base it around the wrong method I'm using of just sending a userID with the request
    route.post('/list/repos', celebrate({
        [Segments.BODY]: Joi.object().keys({
            userID: Joi.number().required(),
            orgID: Joi.number().required(),
            depName: Joi.string().required()
        }),
    }),
    async (req, res) => {
        try {
            const orgService = new OrgService(null,null,null);
            const depService = new DependencyService(null);

            // make sure dep exists in dep list to avoid user passing malicious depName into SQL command
            // since orgID is checked to be a number, I think this is safe
            const depList = await orgService.listDeps({
                orgID: req.body.orgID
            });
            // depExists passes back the depName from the list of deps from the db, so the user input
            // string never touches our SQL query
            const { exists, name } = await orgService.depExists({
                depList: depList,
                depName: req.body.depName
            });

            if (!exists) {
                Logger.error("User sent an invalid dependency name");
                throw new Error(config.ERROR_MESSAGES.invalid_dep_name);
            }
 
            let repos = await depService.listRepos({
                depName: name,
                orgID: req.body.orgID
            });

            let formattedRepoList = []
            for (const repo of repos) {
                const depVersion = await depService.getDepVersion({
                    repoID: repo[dbRows.repo_id],
                    depName: name
                })
                formattedRepoList.push({
                    name: repo[dbRows.repo_name],
                    version: depVersion
                });
            }
            
            return res.status(200).json(formattedRepoList);
        } catch (error) {
            Logger.error(error);
            const errRes = await errorHandler(error);
            return res.status(errRes.status).json({error: errRes.error});
        }
    });
}