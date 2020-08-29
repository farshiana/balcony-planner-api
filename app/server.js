import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from 'morgan';
import auth from './routes/auth.routes';
import db from './models/models';
import { ROLE_USER, ROLE_ADMIN } from './constants';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(logger('dev'));
app.use(cors({ origin: 'http://localhost:8081' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync({ force: true }).then(() => {
    db.Role.create({ name: ROLE_USER });
    db.Role.create({ name: ROLE_ADMIN });
});

auth(app);

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}.`); });
