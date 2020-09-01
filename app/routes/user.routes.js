import { getUser } from '../controllers/users.controller';
import { checkAuth } from '../middlewares/auth.middleware';

export default (app) => {
    app.get('/users/current', checkAuth, getUser);
};
