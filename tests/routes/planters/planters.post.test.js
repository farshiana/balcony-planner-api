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
    beforeAll(async () => {
        ({ cookie } = await auth());
    });

    let params;
    beforeEach(() => {
        params = {
            name: faker.lorem.word(),
            shape: SHAPES[0],
            dimensions: JSON.stringify({ radius: faker.random.number() }),
            color: COLORS[0],
            exposure: EXPOSURES[0],
        };
    });

    describe('creates planter', () => {
        it('with params', async () => {
            const res = await request(app).post(route).set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(201);

            const planter = await Planter.findByPk(res.body.id);
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(planter)));
        });
    });

    describe('does not create planter', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).post(route).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('with invalid shape', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, shape: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });

        it('with invalid width', async () => {
            // TODO: implement rules
        });

        it('with invalid color', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, color: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });

        it('with invalid exposure', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, exposure: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });
    });
});
