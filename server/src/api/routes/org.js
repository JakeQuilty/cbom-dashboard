import { Router, Request, Response } from "express";
import middlewares from '../middlewares';
import { Container } from 'typedi';
import OrgService from '../../services/org';
import { celebrate, Joi } from 'celebrate';
const logger = require('winston');

const route = Router();

export default (app) => {
    app.use('/api/org', route);

    route.get('/list', (req, res) =>{
        return res.status(200);
    });

    app.post('/new',
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                ghAuthToken: Joi.string().required(),
                userID: Joi.string().required(),
            }),
        }),
        (req, res) => {
            logger.debug('Creaiting new org\nbody: %o', req.body);
            const reqData = {
                name: req.body.name,
                ghAuthToken: req.body.ghAuthToken,
                userID: req.body.userID
            }
            try {
                orgServiceInstance = Container.get(OrgService);
                const { name } = await orgServiceInstance.CreateNewOrg(reqData);
                return res.status(201).json({ name });
            } catch (error){
                logger.error(error);
                return res.status(500);
            }
        });
}