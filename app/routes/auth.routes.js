import Joi from 'joi';
import { checkDuplicates, checkAuth } from '../middlewares/auth.middleware';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import validator from '../middlewares/validator.middleware';

const email = Joi.string().trim().lowercase().email()
    .required();
const username = Joi.string().trim().lowercase().required();
const password = Joi.string().min(12).required(); // TODO: pattern + and custom message

export default (app) => {
    app.post('/auth/register', validator({ email, username, password }), checkDuplicates, register, login);
    app.put('/auth/login', validator({ email, password }), login);
    app.get('/auth/current', checkAuth, getCurrentUser);
};
