import Joi from 'joi';
import { checkDuplicates } from '../middlewares/auth.middleware';
import { register, login } from '../controllers/auth.controller';
import validation from '../middlewares/validation.middleware';

const email = Joi.string().email().required();
const username = Joi.string().required();
const password = Joi.string().min(12).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required();

export default (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
        next();
    });

    app.post('/auth/register', [
        validation({ email, username, password }),
        checkDuplicates,
    ], register);

    app.post('/auth/login', [validation({ username, password })], login);
};
