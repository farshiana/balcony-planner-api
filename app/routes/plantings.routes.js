import { body } from 'express-validator';
import {
    addPlanting,
    getAllPlantings,
    updatePlanting,
} from '../controllers/plantings.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';

const varietyId = body('varietyId').isUUID();
const planterId = body('planterId').isUUID();
const seed = body('seed').isLength({ min: 1 });
const plant = body('plant').isLength({ min: 1 });
const harvest = body('harvest').isLength({ min: 1 });

export default (app) => {
    app.post('/plantings', checkAuth, validator(varietyId, planterId, seed, plant, harvest), addPlanting);
    app.put('/plantings/:plantId', checkAuth, validator(seed, plant, harvest), updatePlanting);
    app.get('/plantings', checkAuth, getAllPlantings);
};
