import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from 'morgan';
import session from 'express-session';
import connect from 'connect-session-sequelize';
import helmet from 'helmet';
import auth from './routes/auth.routes';
import balconies from './routes/balconies.routes';
import genera from './routes/genera.routes';
import varieties from './routes/varieties.routes';
import planters from './routes/planters.routes';
import plants from './routes/plants.routes';
import plantings from './routes/plantings.routes';
import db from './models/models';
import config from './config/auth.config';

const authConfig = config[process.env.NODE_ENV];

const app = express();
const PORT = process.env.PORT || 8080;

const SequelizeStore = connect(session.Store);
const store = new SequelizeStore({
    db: db.sequelize,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000,
});

app.use(
    session({
        secret: authConfig.secret,
        resave: false,
        saveUninitialized: false,
        cookie: authConfig.cookie,
        store,
    }),
);
app.use(helmet());
app.use(logger('dev'));
app.use(cors({ credentials: true, origin: 'http://localhost:8081' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

store.sync();
db.sequelize.sync();

auth(app);
balconies(app);
genera(app);
varieties(app);
planters(app);
plants(app);
plantings(app);

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}.`); });

export default app;
