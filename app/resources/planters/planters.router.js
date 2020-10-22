import Joi from 'joi';
import { Router } from 'express';
import {
    addPlanter, getAllPlanters, updatePlanter, deletePlanter,
} from './planters.controller';
import validator from '../../middlewares/validator.middleware';
import { SHAPES, COLORS, EXPOSURES } from '../../constants';

const name = Joi.string().trim().lowercase().required();
const shape = Joi.valid(...SHAPES).required();
const position = Joi.object().required(); // TODO: add more validation
const dimensions = Joi.object().required(); // TODO: add more validation depending on the shape
const color = Joi.valid(...COLORS).required();
const exposure = Joi.valid(...EXPOSURES).required();

const router = Router();
router.route('/')
    .post(validator({
        name, shape, position, dimensions, color, exposure,
    }), addPlanter)
    .get(getAllPlanters);
router.put('/:planterId', validator({
    name, shape, position, dimensions, color, exposure,
}), updatePlanter);
router.delete('/:planterId', deletePlanter);

export default router;
