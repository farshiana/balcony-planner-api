import { body } from 'express-validator';
import { checkDuplicates } from '../middlewares/auth.middleware';
import { register, login } from '../controllers/auth.controller';
import validator from '../middlewares/validator.middleware';

const email = body('email').isEmail().normalizeEmail();
const username = body('username').trim().escape().notEmpty();
const password = body('password').isLength({ min: 12 });

export default (app) => {
    app.post('/auth/register',
        validator(email, username, password),
        checkDuplicates,
        register,
        login);
    app.put('/auth/login', validator(email, password), login);
};
