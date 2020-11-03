import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { ROLE_ADMIN, CATEGORIES } from '@/constants';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';

const route = '/genera';

describe('Genera PUT', () => {
    let cookie;
    beforeAll(async (done) => {
        ({ cookie } = await auth({ username: 'genera.put', role: ROLE_ADMIN }));
        done();
    });

    let params;
    let genus;
    beforeEach(async (done) => {
        params = {
            name: faker.random.word().toLowerCase(),
            category: CATEGORIES[1],
        };
        genus = await createGenus();
        done();
    });

    describe('updates genus', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${genus.id}`)
                .set('Cookie', cookie).send(params);

            await genus.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(genus)));
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('does not update genus', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${genus.id}`).send(params);

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send({ ...params, name: 'inexistent' });

            expect(res.body.message).toEqual('Genus does not exist');
            expect(res.statusCode).toEqual(404);
        });

        it('with existing name', async () => {
            await createGenus(params);
            const res = await request(app).put(`${route}/${genus.id}`)
                .set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('Genus already exists');
            expect(res.statusCode).toEqual(400);
        });

        it('with invalid category', async () => {
            const res = await request(app).put(`${route}/${genus.id}`)
                .set('Cookie', cookie).send({ ...params, category: 'invalid' });

            expect(res.body.message).toMatch('"category" must be one of [');
            expect(res.statusCode).toEqual(400);
        });
    });
});
