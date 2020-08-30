import { body } from 'express-validator';
import { addGenus, getAllGenera, updateGenus } from '../controllers/genus.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware';
import { CATEGORIES } from '../constants';

const name = body('name').trim().escape().notEmpty();
const category = body('category').isIn(CATEGORIES);

export default (app) => {
    app.post('/genera', checkAuth, checkAdmin, validator(name, category), addGenus);
    app.put('/genera/:genusId', checkAuth, checkAdmin, validator(name, category), updateGenus);
    app.get('/genera', checkAuth, getAllGenera);
};
