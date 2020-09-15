import { body } from 'express-validator';
import { addBalcony, getAllBalconies, updateBalcony } from '../controllers/balconies.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';

const name = body('name').trim().escape().notEmpty();
const width = body('width').isNumeric();
const height = body('height').isNumeric();

export default (app) => {
    app.post('/balconies', checkAuth, validator(name, width, height), addBalcony);
    app.put('/balconies/:balconyId', checkAuth, validator(name, width, height), updateBalcony);
    app.get('/balconies', checkAuth, getAllBalconies);
};
