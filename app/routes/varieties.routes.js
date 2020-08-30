import { body } from 'express-validator';
import { addVariety, getAllVarieties, updateVariety } from '../controllers/varieties.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware';
import { EXPOSURES, WATERINGS } from '../constants';

const name = body('name').trim().escape().notEmpty();
const exposure = body('exposure').isIn(EXPOSURES);
const watering = body('watering').isIn(WATERINGS);

export default (app) => {
    app.post('/genera/:genusId/varieties', checkAuth, checkAdmin, validator(name, exposure, watering), addVariety);
    app.put('/varieties/:varietyId', checkAuth, checkAdmin, validator(name, exposure, watering), updateVariety);
    app.get('/varieties', checkAuth, getAllVarieties);
};
