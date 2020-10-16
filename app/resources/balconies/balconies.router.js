import Joi from 'joi';
import { Router } from 'express';
import { updateBalcony } from './balconies.controller';
import validator from '../../middlewares/validator.middleware';
import { checkAuth } from '../../middlewares/auth.middleware';

const width = Joi.number().positive().required();
const height = Joi.number().positive().required();

const router = Router();
router.put('/:balconyId', checkAuth, validator({ width, height }), updateBalcony);

export default router;
