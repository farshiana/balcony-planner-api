import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { CATEGORIES } from '@/constants';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';

const route = '/genera';

describe('Genera PUT', () => {
    let cookie;
    beforeAll(async () => {
        ({ cookie } = await auth());
    });

    let params;
    let genus;
    beforeEach(async () => {
        params = {
            name: faker.lorem.word(),
            category: CATEGORIES[1],
        };
        genus = await createGenus();
    });

    describe('updates genus', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${genus.id}`)
                .set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(200);

            await genus.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(genus)));
        });
    });

    describe('does not update genus', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${genus.id}`).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('with non admin user', async () => {
            // TODO
        });

        it('that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send({ ...params, name: 'inexistent' });

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Genus does not exist');
        });

        it('with existing name', async () => {
            await createGenus(params);
            const res = await request(app).put(`${route}/${genus.id}`)
                .set('Cookie', cookie).send(params);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Genus already exists');
        });

        it('with invalid category', async () => {
            const res = await request(app).put(`${route}/${genus.id}`)
                .set('Cookie', cookie).send({ ...params, category: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });
    });
});
