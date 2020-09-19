import { body } from 'express-validator';
import { addPlanter, getAllPlanters, updatePlanter } from '../controllers/planters.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';
import { SHAPES, COLORS, EXPOSURES } from '../constants';

const name = body('name').trim().escape().notEmpty();
const shape = body('shape').isIn(SHAPES);
const dimensions = body('dimensions').isJSON();
const color = body('color').isIn(COLORS);
const exposure = body('exposure').isIn(EXPOSURES);

export default (app) => {
    app.post('/planters', checkAuth,
        validator(name, shape, dimensions, color, exposure), addPlanter);
    app.put('/planters/:planterId', checkAuth,
        validator(name, shape, dimensions, color, exposure), updatePlanter);
    app.get('/planters', checkAuth, getAllPlanters);
};
