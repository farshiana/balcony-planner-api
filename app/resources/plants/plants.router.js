import Joi from 'joi';
import { Router } from 'express';
import { addPlant, getAllPlants, updatePlant } from './plants.controller';
import validator from '../../middlewares/validator.middleware';
import { checkAuth } from '../../middlewares/auth.middleware';

const notes = Joi.string().trim().allow('');
const varietyId = Joi.string().uuid().required();

const router = Router();
router.route('/', checkAuth)
    .post(validator({ notes, varietyId }), addPlant)
    .get(getAllPlants);
router.put('/:plantId', checkAuth, validator({ notes }), updatePlant);

export default router;
