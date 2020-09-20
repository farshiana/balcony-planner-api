import Joi from 'joi';
import { addPlanter, getAllPlanters, updatePlanter } from '../controllers/planters.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';
import { SHAPES, COLORS, EXPOSURES } from '../constants';

const name = Joi.string().trim().lowercase().required();
const shape = Joi.valid(...SHAPES).required();
const dimensions = Joi.object().required(); // TODO: add more validation depending on the shape
const color = Joi.valid(...COLORS).required();
const exposure = Joi.valid(...EXPOSURES).required();

export default (app) => {
    app.post('/planters', checkAuth,
        validator({
            name, shape, dimensions, color, exposure,
        }), addPlanter);
    app.put('/planters/:planterId', checkAuth,
        validator({
            name, shape, dimensions, color, exposure,
        }), updatePlanter);
    app.get('/planters', checkAuth, getAllPlanters);
};
