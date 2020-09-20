import { body } from 'express-validator';
import { addPlanting, updatePlanting } from '../controllers/plantings.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';

const seed = body('seed').isLength({ min: 1 });
const plant = body('plant').isLength({ min: 1 });
const harvest = body('harvest').isLength({ min: 1 });
const planterId = body('planterId').isUUID();
const varietyId = body('varietyId').isUUID();

export default (app) => {
    app.post('/plantings', checkAuth, validator(seed, plant, harvest, planterId, varietyId), addPlanting);
    app.put('/plantings/:plantingId', checkAuth, validator(seed, plant, harvest), updatePlanting);
};
