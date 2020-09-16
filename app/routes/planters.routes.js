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
const balconyId = body('balconyId').isUUID();

export default (app) => {
    app.post('/users/:userId/planters', checkAuth,
        validator(name, shape, dimensions, color, exposure, balconyId), addPlanter);
    app.put('/users/:userId/planters/:planterId', checkAuth,
        validator(name, shape, dimensions, color, exposure), updatePlanter);
    app.get('/users/:userId/planters', checkAuth, getAllPlanters);
};
