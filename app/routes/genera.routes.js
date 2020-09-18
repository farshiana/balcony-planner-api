import { body } from 'express-validator';
import { addGenus, getAllGenera, updateGenus } from '../controllers/genera.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware';
import { CATEGORIES } from '../constants';
import { checkDuplicates } from '../middlewares/genera.middleware';

const name = body('name').trim().escape().notEmpty();
const category = body('category').isIn(CATEGORIES);

export default (app) => {
    app.post('/genera', checkAuth, checkAdmin, validator(name, category), checkDuplicates, addGenus);
    app.put('/genera/:genusId', checkAuth, checkAdmin, validator(name, category), checkDuplicates, updateGenus);
    app.get('/genera', checkAuth, getAllGenera);
};
