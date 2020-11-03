import Joi from 'joi';
import { Router } from 'express';
import { checkDuplicates } from '../../middlewares/auth.middleware';
import {
    register, login, logout, getCurrentUser,
} from './auth.controller';
import validator from '../../middlewares/validator.middleware';

const username = Joi.string().trim().lowercase().required();
const password = Joi.string().min(12).required(); // TODO: enforce secure password

const router = Router();
router.post('/register', validator({ username, password }), checkDuplicates, register, login);
router.post('/logout', logout);
router.put('/login', validator({ username, password }), login);
router.get('/current', getCurrentUser);

export default router;
