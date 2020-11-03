import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import { ROLE_ADMIN, CATEGORIES } from '@/constants';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';

const { Genus } = db;
const route = '/genera';

describe('Genera POST', () => {
    let cookie;
    let params;
    beforeEach(async (done) => {
        ({ cookie } = await auth({ role: ROLE_ADMIN }));
        params = {
            name: faker.random.word().toLowerCase(),
            category: CATEGORIES[1],
        };
        done();
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
            ({ cookie } = await auth());
            const res = await request(app).post(route).set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('Admin role is required');
            expect(res.statusCode).toEqual(403);
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

            expect(res.body.message).toMatch('"category" must be one of [');
            expect(res.statusCode).toEqual(400);
        });
    });
});
