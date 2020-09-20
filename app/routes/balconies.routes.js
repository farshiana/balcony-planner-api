import Joi from 'joi';
import { updateBalcony } from '../controllers/balconies.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';

const width = Joi.number().positive().required();
const height = Joi.number().positive().required();

export default (app) => {
    app.put('/balconies/:balconyId', checkAuth, validator({ width, height }), updateBalcony);
};
