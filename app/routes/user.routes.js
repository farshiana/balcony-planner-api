import { checkAuth } from '../middlewares/auth.middleware';
import { getCurrentUser } from '../controllers/auth.controller';

export default (app) => {
    app.get('/users/current', checkAuth, getCurrentUser);
};
