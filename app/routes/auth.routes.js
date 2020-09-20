import Joi from 'joi';
import { checkDuplicates, checkAuth } from '../middlewares/auth.middleware';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import validator from '../middlewares/validator.middleware';

const email = Joi.string().trim().lowercase().email()
    .required();
const username = Joi.string().trim().lowercase().required();
const password = Joi.string().min(12).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required();

export default (app) => {
    app.post('/auth/register', validator({ email, username, password }), checkDuplicates, register, login);
    app.put('/auth/login', validator({ email, password }), login);
    app.get('/auth/current', checkAuth, getCurrentUser);
};
