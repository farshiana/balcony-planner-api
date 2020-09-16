import { body } from 'express-validator';
import { updateBalcony } from '../controllers/balconies.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';

const name = body('name').trim().escape().notEmpty();
const width = body('width').isNumeric();
const height = body('height').isNumeric();

export default (app) => {
    app.put('/users/:userId/balconies/:balconyId', checkAuth, validator(name, width, height), updateBalcony);
};
