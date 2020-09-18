import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { CATEGORIES } from '@/constants';
import db from '@/models/models';
import createCookie from '../factories/cookie.factory';
import createGenus from '../factories/genus.factory';

const { Genus } = db;
const route = '/genera';

describe(route, () => {
    let cookie;
    beforeAll(async () => {
        cookie = await createCookie();
    });

    describe('index', () => {
        it('returns all genera', async () => {
            const genus1 = await createGenus();
            const genus2 = await createGenus();
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(JSON.parse(JSON.stringify([genus1, genus2])));
        });
    });

    describe('create', () => {
        const params = {
            name: faker.lorem.word(),
            category: CATEGORIES[1],
        };

        it('creates genus', async () => {
            const res = await request(app).post(route).set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(201);

            const genus = await Genus.findByPk(res.body.id);
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(genus)));
        });

        it('does not create genus with unauthenticated user', async () => {
            const res = await request(app).post(route).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('does not create genus with existing name', async () => {
            await createGenus({ name: 'duplicate' });
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, name: 'duplicate' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Genus already exists');
        });

        it('does not create genus with invalid category', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, category: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });
    });

    describe('update', () => {
        const params = {
            name: faker.lorem.word(),
            category: CATEGORIES[1],
        };
        let genus;
        beforeAll(async () => {
            genus = await createGenus();
        });

        it('updates genus', async () => {
            const res = await request(app).put(`${route}/${genus.id}`)
                .set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(200);

            await genus.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(genus)));
        });

        it('does not update genus with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${genus.id}`).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('does not update genus with existing name', async () => {
            const res = await request(app).put(`${route}/${genus.id}`)
                .set('Cookie', cookie).send({ ...params, name: 'duplicate' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Genus already exists');
        });

        it('does not update genus with invalid category', async () => {
            const res = await request(app).put(`${route}/${genus.id}`)
                .set('Cookie', cookie).send({ ...params, category: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });
    });
});
