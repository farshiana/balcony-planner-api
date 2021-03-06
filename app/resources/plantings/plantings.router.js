import Joi from 'joi';
import { Router } from 'express';
import { addPlanting, updatePlanting, deletePlanting } from './plantings.controller';
import validator from '../../middlewares/validator.middleware';

const position = Joi.object().required();
const seed = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const plant = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const harvest = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const planterId = Joi.string().uuid().required();
const plantId = Joi.string().uuid().required();

const router = Router();
router.post('/', validator({
    position, seed, plant, harvest, planterId, plantId,
}), addPlanting);
router.put('/:plantingId', validator({
    position, seed, plant, harvest,
}), updatePlanting);
router.delete('/:plantingId', deletePlanting);

export default router;
