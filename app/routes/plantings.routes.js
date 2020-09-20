import Joi from 'joi';
import { addPlanting, updatePlanting } from '../controllers/plantings.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';

const seed = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const plant = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const harvest = Joi.array().items(Joi.number().min(0).max(11)).max(12).required();
const planterId = Joi.string().uuid().required();
const varietyId = Joi.string().uuid().required();

export default (app) => {
    app.post('/plantings', checkAuth, validator({
        seed, plant, harvest, planterId, varietyId,
    }), addPlanting);
    app.put('/plantings/:plantingId', checkAuth, validator({ seed, plant, harvest }), updatePlanting);
};
