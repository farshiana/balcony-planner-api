import Joi from 'joi';
import { Router } from 'express';
import { addVariety, getAllVarieties, updateVariety } from './varieties.controller';
import validator from '../../middlewares/validator.middleware';
import { checkAdmin } from '../../middlewares/auth.middleware';
import { EXPOSURES, WATERINGS } from '../../constants';
import { checkDuplicates } from '../../middlewares/varieties.middleware';

const name = Joi.string().trim().lowercase().required();
const imageUrl = Joi.string().uri().required(); // TODO: testvalidation (http + domain)
const exposure = Joi.valid(...EXPOSURES).required();
const watering = Joi.valid(...WATERINGS).required();
const seed = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const plant = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const harvest = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const genusId = Joi.string().uuid().required();

const router = Router();
router.route('/')
    .post(checkAdmin, validator({
        name, imageUrl, exposure, watering, seed, plant, harvest, genusId,
    }), checkDuplicates, addVariety)
    .get(getAllVarieties);
router.put('/:varietyId', checkAdmin, validator({
    name, imageUrl, exposure, watering, seed, plant, harvest,
}), checkDuplicates, updateVariety);

export default router;
