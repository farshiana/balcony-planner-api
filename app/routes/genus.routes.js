import { body } from 'express-validator';
import { addGenus, getGenera, updateGenus } from '../controllers/genus.controller';
import { validate } from '../middlewares/validator.middleware';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware';
import { categories } from '../constants';

const name = body('name').trim().escape().notEmpty();
const category = body('category').isIn(categories);

export default (app) => {
    app.post('/genera', checkAuth, checkAdmin, validate(name, category), addGenus);

    app.put('/genera/:genusId', checkAuth, checkAdmin, validate(name, category), updateGenus);

    app.get('/genera', checkAuth, getGenera);
};
