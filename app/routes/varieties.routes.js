import { body } from 'express-validator';
import { addVariety, getAllVarieties, updateVariety } from '../controllers/varieties.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware';
import { EXPOSURES, WATERINGS } from '../constants';

const name = body('name').trim().escape().notEmpty();
const exposure = body('exposure').isIn(EXPOSURES);
const watering = body('watering').isIn(WATERINGS);
const seed = body('seed').isLength({ min: 1 });
const plant = body('plant').isLength({ min: 1 });
const harvest = body('harvest').isLength({ min: 1 });
const genusId = body('genusId').isUUID();
// TODO: validate array of numbers between 0 & 11

export default (app) => {
    app.post('/genera/:genusId/varieties', checkAuth, checkAdmin,
        validator(name, exposure, watering, seed, plant, harvest, genusId), addVariety);
    app.put('/genera/:genusId/varieties/:varietyId', checkAuth, checkAdmin,
        validator(name, exposure, watering, seed, plant, harvest, genusId), updateVariety);
    app.get('/genera/:genusId/varieties', checkAuth, getAllVarieties);
};
