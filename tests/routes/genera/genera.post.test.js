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
    beforeAll(async () => {
        ({ cookie } = await auth());
    });

    let params;
    beforeEach(() => {
        params = {
            name: faker.lorem.word(),
            category: CATEGORIES[1],
        };
    });

    describe('creates genus', () => {
        it('with params', async () => {
            const res = await request(app).post(route).set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(201);

            const genus = await Genus.findByPk(res.body.id);
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(genus)));
        });
    });

    describe('does not create genus', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).post(route).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('with non admin user', async () => {
            // TODO
        });

        it('with existing name', async () => {
            await createGenus(params);
            const res = await request(app).post(route)
                .set('Cookie', cookie).send(params);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Genus already exists');
        });

        it('with invalid category', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, category: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });
    });
});
