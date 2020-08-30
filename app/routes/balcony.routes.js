import { body } from 'express-validator';
import { addBalcony, getBalconies, updateBalcony } from '../controllers/balcony.controller';
import { validate } from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';

const name = body('name').trim().escape().notEmpty();
const width = body('width').isNumeric();
const height = body('height').isNumeric();

export default (app) => {
    app.post('/users/:userId/balconies', checkAuth, validate(name, width, height), addBalcony);

    app.put('/users/:userId/balconies/:balconyId', checkAuth, validate(name, width, height), updateBalcony);

    app.get('/users/:userId/balconies', checkAuth, getBalconies);
};
