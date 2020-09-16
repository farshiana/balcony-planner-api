import { body } from 'express-validator';
import { addPlanting, updatePlanting } from '../controllers/plantings.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';

const varietyId = body('varietyId').isUUID();
const seed = body('seed').isLength({ min: 1 });
const plant = body('plant').isLength({ min: 1 });
const harvest = body('harvest').isLength({ min: 1 });

export default (app) => {
    app.post('/planters/:planterId/plantings', checkAuth, validator(varietyId, seed, plant, harvest), addPlanting);
    app.put('/planters/:planterId/plantings/:plantId', checkAuth, validator(seed, plant, harvest), updatePlanting);
};
