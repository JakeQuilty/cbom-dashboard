const express = require("express");
const { models } = require('../../db');
const config = require("../../config");
const {celebrate, Joi, Segments} = require('celebrate');
const Logger = require('../../loaders/logger');
const { errorHandler } = require('../errorHandler');
const RepoService = require("../../services/RepoService");

const route = express.Router();

const dbRows = {
    repo_id: [config.dbTables.repository.repo_id],
    repo_name: [config.dbTables.repository.repo_name],
    default_branch: [config.dbTables.repository.default_branch]
}

module.exports = (app) => {
    app.use('/repo', route);

    route.post('/list',celebrate({
        [Segments.BODY]: Joi.object().keys({
            userID: Joi.number().required(),
            orgID: Joi.number().required()
        }),
    }),
    async (req, res) =>{
        try {
            const repoService = new RepoService(null, models, null, null);
            const repoList = await repoService.list(req.body);

            let formattedRepos = []
            for (const repo of repoList) {
                formattedRepos.push({
                    id: repo[dbRows.repo_id],
                    name:repo[dbRows.repo_name],
                    defaultBranch: repo[dbRows.default_branch]
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
}