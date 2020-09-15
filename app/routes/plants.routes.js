import { body } from 'express-validator';
import {
    addPlant,
    getAllPlants,
    updatePlant,
} from '../controllers/plants.controller';
import validator from '../middlewares/validator.middleware';
import { checkAuth } from '../middlewares/auth.middleware';
import { checkUser } from '../middlewares/user.middleware';

const notes = body('notes').trim().escape().notEmpty();

export default (app) => {
    app.post('/users/:userId/plants', checkAuth, checkUser,
        validator(notes), addPlant);
    app.put('/users/:userId/plants/:plantId', checkAuth, checkUser,
        validator(notes), updatePlant);
    app.get('/users/:userId/plants', checkAuth, checkUser, getAllPlants);
};
