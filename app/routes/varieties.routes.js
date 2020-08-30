import { body } from 'express-validator';
import { addVariety, getAllVarieties, updateVariety } from '../controllers/varieties.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware';
import { CATEGORIES } from '../constants';

const name = body('name').trim().escape().notEmpty();
const category = body('category').isIn(CATEGORIES);

export default (app) => {
    app.post('/varieties', checkAuth, checkAdmin, validator(name, category), addVariety);
    app.put('/varieties/:genusId', checkAuth, checkAdmin, validator(name, category), updateVariety);
    app.get('/varieties', checkAuth, getAllVarieties);
};
