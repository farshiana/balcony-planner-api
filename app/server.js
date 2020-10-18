import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from 'morgan';
import session from 'express-session';
import connect from 'connect-session-sequelize';
import helmet from 'helmet';
import authRouter from './resources/auth/auth.router';
import balconiesRouter from './resources/balconies/balconies.router';
import generaRouter from './resources/genera/genera.router';
import varietiesRouter from './resources/varieties/varieties.router';
import plantersRouter from './resources/planters/planters.router';
import plantsRouter from './resources/plants/plants.router';
import plantingsRouter from './resources/plantings/plantings.router';
import imagesRouter from './resources/images/images.router';
import db from './models/models';
import config from './config/auth.config';
import { checkAuth } from './middlewares/auth.middleware';

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

app.all('*', checkAuth);

app.use('/auth', authRouter);
app.use('/balconies', balconiesRouter);
app.use('/genera', generaRouter);
app.use('/varieties', varietiesRouter);
app.use('/planters', plantersRouter);
app.use('/plants', plantsRouter);
app.use('/plantings', plantingsRouter);
app.use('/images', imagesRouter);

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}.`); });

export default app;
