import { body } from 'express-validator';
import { checkDuplicates } from '../middlewares/auth.middleware';
import { register, login } from '../controllers/auth.controller';
import validator from '../middlewares/validator.middleware';

const email = body('email').isEmail().normalizeEmail();
const username = body('username').trim().escape().notEmpty();
const password = body('password').isLength({ min: 12 });

export default (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
        next();
    });

    app.post('/auth/register',
        validator(email, username, password),
        checkDuplicates,
        register,
        login);

    app.post('/auth/login', validator(username, password), login);
};
