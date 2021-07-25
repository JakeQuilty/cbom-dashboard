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
                let repos = await depService.listRepos({depName: dep[dbRows.dep_name]});
                // using the index of the dependencies as the frontend id, because this cuts out
                // duplicates so we can't use the db ids anymore
                formattedDepList.push({id: index, name: dep[dbRows.dep_name], numRepos: repos.length});
            }


            return res.status(200).json(formattedDepList);
        } catch (error) {
            Logger.error(error);
            const errRes = await errorHandler(error);
            return res.status(errRes.status).json({error: errRes.error});
        }
    });

    route.post('/list/repos', celebrate({
        [Segments.BODY]: Joi.object().keys({
            userID: Joi.number().required(),
            repoID: Joi.number().required()
        }),
    }),
    async (req, res) => {
        try {
            const orgService = new OrgService(null,null,null);
            const depService = new DependencyService(null);
            
            const depList = orgService.listDeps({
                orgID: req.body.orgID
            });

            for (const dep of depList) {

            }

            

            return res.status(200).json(formattedDepList);
        } catch (error) {
            Logger.error(error);
            const errRes = await errorHandler(error);
            return res.status(errRes.status).json({error: errRes.error});
        }
    });
}