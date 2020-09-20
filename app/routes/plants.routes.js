import Joi from 'joi';
import {
    addPlant,
    getAllPlants,
    updatePlant,
} from '../controllers/plants.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';

const notes = Joi.string().trim();
const varietyId = Joi.string().uuid().required();

export default (app) => {
    app.post('/plants', checkAuth, validator({ notes, varietyId }), addPlant);
    app.put('/plants/:plantId', checkAuth, validator({ notes }), updatePlant);
    app.get('/plants', checkAuth, getAllPlants);
};
