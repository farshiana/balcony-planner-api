import { body } from 'express-validator';
import { addBalcony, getBalconies } from '../controllers/balcony.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';

const name = body('name').trim().escape().notEmpty();
const width = body('width').isNumeric();
const height = body('height').isNumeric();

export default (app) => {
    app.post('/users/:userId/balconies', checkAuth, validator(name, width, height), addBalcony);

    app.get('/users/:userId/balconies', checkAuth, getBalconies);
};
