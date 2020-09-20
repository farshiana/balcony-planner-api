import Joi from 'joi';
import { addVariety, getAllVarieties, updateVariety } from '../controllers/varieties.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware';
import { EXPOSURES, WATERINGS } from '../constants';
import { checkDuplicates } from '../middlewares/varieties.middleware';

const name = Joi.string().trim().lowercase().required();
const exposure = Joi.valid(...EXPOSURES).required();
const watering = Joi.valid(...WATERINGS).required();
const seed = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const plant = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const harvest = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const genusId = Joi.string().uuid().required();

export default (app) => {
    app.post('/varieties', checkAuth, checkAdmin,
        validator({
            name, exposure, watering, seed, plant, harvest, genusId,
        }), checkDuplicates, addVariety);
    app.put('/varieties/:varietyId', checkAuth, checkAdmin,
        validator({
            name, exposure, watering, seed, plant, harvest,
        }), checkDuplicates, updateVariety);
    app.get('/varieties', checkAuth, getAllVarieties);
};
