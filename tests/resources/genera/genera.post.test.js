import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { CATEGORIES } from '@/constants';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';

const { Genus } = db;
const route = '/genera';

describe('Genera POST', () => {
    let cookie;
    beforeAll(async (done) => {
        ({ cookie } = await auth());
        done();
    });

    let params;
    beforeEach(() => {
        params = {
            name: faker.random.word(),
            category: CATEGORIES[1],
        };
    });

    describe('creates genus', () => {
        it('with params', async () => {
            const res = await request(app).post(route).set('Cookie', cookie).send(params);

            const genus = await Genus.findByPk(res.body.id);
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(genus)));
            expect(res.statusCode).toEqual(201);
        });
    });

    describe('does not create genus', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).post(route).send(params);

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('with non admin user', async () => {
            // TODO
        });

        it('with existing name', async () => {
            await createGenus(params);
            const res = await request(app).post(route)
                .set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('Genus already exists');
            expect(res.statusCode).toEqual(400);
        });

        it('with invalid category', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, category: 'invalid' });

            // expect(res.body.message).toEqual(''); TODO: custom message
            expect(res.statusCode).toEqual(400);
        });
    });
});
