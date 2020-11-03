import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import { SHAPES, COLORS, EXPOSURES } from '@/constants';
import auth from '../../factories/auth.factory';

const { Planter } = db;
const route = '/planters';

describe('Planters POST', () => {
    let cookie;
    beforeAll(async (done) => {
        ({ cookie } = await auth({ username: 'planters.post' }));
        done();
    });

    let params;
    beforeEach(() => {
        params = {
            name: faker.random.word().toLowerCase(),
            shape: SHAPES[0],
            position: { left: faker.random.number(), top: faker.random.number() },
            dimensions: { width: faker.random.number() },
            color: COLORS[0],
            exposure: EXPOSURES[0],
        };
    });

    describe('creates planter', () => {
        it('with params', async () => {
            const res = await request(app).post(route).set('Cookie', cookie).send(params);

            const planter = await Planter.findByPk(res.body.id);
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify({ ...planter.dataValues, plantings: [] })));
            expect(res.statusCode).toEqual(201);
        });
    });

    describe('does not create planter', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).post(route).send(params);

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('with invalid shape', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, shape: 'invalid' });

            expect(res.body.message).toMatch('"shape" must be one of [');
            expect(res.statusCode).toEqual(400);
        });

        it('with invalid color', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, color: 'invalid' });

            expect(res.body.message).toMatch('"color" must be one of [');
            expect(res.statusCode).toEqual(400);
        });

        it('with invalid exposure', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, exposure: 'invalid' });

            expect(res.body.message).toMatch('"exposure" must be one of [');
            expect(res.statusCode).toEqual(400);
        });
    });
});
