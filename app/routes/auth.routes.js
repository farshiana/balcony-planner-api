import { body } from 'express-validator';
import { checkDuplicates } from '../middlewares/auth.middleware';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middlewares/validator.middleware';

const email = body('email').isEmail().normalizeEmail();
const username = body('username').trim().escape().notEmpty();
const password = body('password').isLength({ min: 12 });

export default (app) => {
    app.post('/auth/register',
        validate(email, username, password),
        checkDuplicates,
        register,
        login);

    app.post('/auth/login', validate(username, password), login);
};
