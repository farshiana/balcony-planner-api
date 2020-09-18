import { body } from 'express-validator';
import { updateBalcony } from '../controllers/balconies.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';

const width = body('width').isInt({ min: 0 });
const height = body('height').isInt({ min: 0 });

export default (app) => {
    app.put('/balconies/:balconyId', checkAuth, validator(width, height), updateBalcony);
};
