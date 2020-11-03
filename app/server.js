import express from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from 'morgan';
import session from 'express-session';
import connect from 'connect-session-sequelize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
import sentryConfig from './config/sentry.config';
import { checkAuth } from './middlewares/auth.middleware';
import docs from './docs';

const authConfig = config[process.env.NODE_ENV];

const app = express();
const PORT = process.env.PORT || 5000;

Sentry.init({
    dsn: sentryConfig[process.env.NODE_ENV].dsn,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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
app.use(cors({ credentials: true, origin: process.env.APP_URL }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Limit 300 requests per 15min
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

store.sync();
db.sequelize.sync();

app.get('/health-check', (req, res) => {
    res.sendStatus(200);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));

app.all('*', checkAuth);

app.use('/auth', authRouter);
app.use('/balconies', balconiesRouter);
app.use('/genera', generaRouter);
app.use('/varieties', varietiesRouter);
app.use('/planters', plantersRouter);
app.use('/plants', plantsRouter);
app.use('/plantings', plantingsRouter);
app.use('/images', imagesRouter);

app.use(Sentry.Handlers.errorHandler());
app.use((req, res) => {
    res.statusCode = 500;
    res.end(`${res.sentry}\n`);
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => { console.log(`Server is running on port ${PORT}.`); });
}

export default app;
