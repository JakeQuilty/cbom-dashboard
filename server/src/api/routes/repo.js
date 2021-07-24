const express = require("express");
const { models } = require('../../db');
const config = require("../../config");
const {celebrate, Joi, Segments} = require('celebrate');
const Logger = require('../../loaders/logger');
const { errorHandler } = require('../errorHandler');
const { base64enc } = require('../../utils/crypto.util');
const RepoService = require("../../services/RepoService");
const DependencyFileService = require("../../services/DependencyFileService");

const route = express.Router();

const dbRows = {
    repo_id: [config.dbTables.repository.repo_id],
    repo_name: [config.dbTables.repository.repo_name],
    default_branch: [config.dbTables.repository.default_branch],

    dep_id: [config.dbTables.dependency.dep_id],
    dep_name: [config.dbTables.dependency.dep_name],
    dep_version: [config.dbTables.dependency.dep_version],

    depfile_path: [config.dbTables.dependencyFile.file_path]
}

module.exports = (app) => {
    app.use('/repo', route);

    route.post('/list',celebrate({
        [Segments.BODY]: Joi.object().keys({
            userID: Joi.number().required(),
            orgID: Joi.number().required()
        }),
    }),
    async (req, res) => {
        try {
            const repoService = new RepoService(null, models, null, null);

            const repoList = await repoService.list(req.body);

            let formattedRepos = []
            for (const repo of repoList) {

                const numDeps = await repoService.countDeps({
                    repoID: repo[dbRows.repo_id]
                });

                formattedRepos.push({
                    id: repo[dbRows.repo_id],
                    name:repo[dbRows.repo_name],
                    defaultBranch: repo[dbRows.default_branch],
                    numDeps: numDeps
                })
            }

            let data = {
                repos: formattedRepos,
                numRepos: formattedRepos.length
            }
            

            return res.status(200).json(data);
        } catch (error) {
            Logger.error(error);
            const errRes = await errorHandler(error);
            return res.status(errRes.status).json({error: errRes.error});
        }
    });

    route.post('/list/deps', celebrate({
        [Segments.BODY]: Joi.object().keys({
            userID: Joi.number().required(),
            repoID: Joi.number().required()
        }),
    }),
    async (req, res) => {
        try {
            const repoService = new RepoService(null, null, null, null);
            const depfileService = new DependencyFileService(null, models, null);

            // check user owns repo

            // get list
            // this is bad bc we're directly sending user input into a SQL query - fix
            const depList = await repoService.listDeps({
                repoID: req.body.repoID
            });

            let formattedDepList = []
            for (const dep of depList) {
                // get path
                const depfilePath = await depfileService.retrieve(req.body.repoID);

                // base64 encode path
                const encodedDepfilePath = await base64enc(depfilePath[dbRows.depfile_path]);
                
                // ommitting scan date for now
                formattedDepList.push({
                    id: dep[dbRows.dep_id],
                    name: dep[dbRows.dep_name],
                    version: dep[dbRows.dep_version],
                    path: encodedDepfilePath
                });
            }

            return res.status(200).json(formattedDepList);
        } catch (error) {
            Logger.error(error);
            const errRes = await errorHandler(error);
            return res.status(errRes.status).json({error: errRes.error});
        }
    });
}