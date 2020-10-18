import Joi from 'joi';
import { Router } from 'express';
import { addPlanting, updatePlanting } from './plantings.controller';
import validator from '../../middlewares/validator.middleware';

const position = Joi.object().required(); // TODO: add more validation
const seed = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const plant = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const harvest = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const planterId = Joi.string().uuid().required();
const varietyId = Joi.string().uuid().required();

const router = Router();
router.post('/', validator({
    position, seed, plant, harvest, planterId, varietyId,
}), addPlanting);
router.put('/:plantingId', validator({
    position, seed, plant, harvest,
}), updatePlanting);

export default router;
