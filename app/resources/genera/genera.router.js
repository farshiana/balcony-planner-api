import Joi from 'joi';
import { Router } from 'express';
import {
    addGenus, getAllGenera, updateGenus, deleteGenus,
} from './genera.controller';
import validator from '../../middlewares/validator.middleware';
import { checkAdmin } from '../../middlewares/auth.middleware';
import { CATEGORIES } from '../../constants';
import { checkDuplicates } from '../../middlewares/genera.middleware';

const name = Joi.string().trim().lowercase().required();
const category = Joi.valid(...CATEGORIES).required();

const router = Router();
router.route('/')
    .post(checkAdmin, validator({ name, category }), checkDuplicates, addGenus)
    .get(getAllGenera);
router.put('/:genusId', checkAdmin, validator({ name, category }), checkDuplicates, updateGenus);
router.delete('/:genusId', checkAdmin, deleteGenus);

export default router;
