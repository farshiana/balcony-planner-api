import Joi from 'joi';
import { Router } from 'express';
import {
    addPlant, getAllPlants, updatePlant, deletePlant,
} from './plants.controller';
import validator from '../../middlewares/validator.middleware';

const notes = Joi.string().trim().allow('');
const varietyId = Joi.string().uuid().required();

const router = Router();
router.route('/')
    .post(validator({ notes, varietyId }), addPlant)
    .get(getAllPlants);
router.put('/:plantId', validator({ notes }), updatePlant);
router.delete('/:plantId', deletePlant);

export default router;
