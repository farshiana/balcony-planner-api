import { body } from 'express-validator';
import { addVariety, getAllVarieties, updateVariety } from '../controllers/varieties.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware';
import { EXPOSURES, WATERINGS, STEPS } from '../constants';

const name = body('name').trim().escape().notEmpty();
const exposure = body('exposure').isIn(EXPOSURES);
const watering = body('watering').isIn(WATERINGS);
const steps = body('steps').isLength({ min: 1 });
const stepsType = body('steps.*.type').isIn(STEPS);
const stepsStartDate = body('steps.*.startDate').isDate({ format: 'yyyy-mm-dd' });
const stepsEndDate = body('steps.*.endDate').isDate({ format: 'yyyy-mm-dd' });

export default (app) => {
    app.post('/genera/:genusId/varieties', checkAuth, checkAdmin,
        validator(name, exposure, watering, steps, stepsType, stepsStartDate, stepsEndDate), addVariety);
    app.put('/varieties/:varietyId', checkAuth, checkAdmin,
        validator(name, exposure, watering, steps, stepsType, stepsStartDate, stepsEndDate), updateVariety);
    app.get('/varieties', checkAuth, getAllVarieties);
};
