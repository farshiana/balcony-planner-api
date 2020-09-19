import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import { EXPOSURES, WATERINGS } from '@/constants';
import auth from '../../factories/auth.factory';
import createVariety from '../../factories/variety.factory';
import createGenus from '../../factories/genus.factory';

const route = '/varieties';

describe('Varieties PUT', () => {
    let cookie;
    let genus;
    beforeAll(async () => {
        ({ cookie } = await auth());
        genus = await createGenus();
    });

    let params;
    let variety;
    beforeEach(async () => {
        params = {
            name: faker.lorem.word(),
            exposure: EXPOSURES[1],
            watering: WATERINGS[1],
            seed: [0, 1, 2],
            plant: [3, 4, 5],
            harvest: [6, 7, 8],
        };
        variety = await createVariety();
    });

    describe('updates variety', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${variety.id}`)
                .set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(200);

            await variety.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(variety)));
        });

        it('without changing genusId', async () => {
            const res = await request(app).put(`${route}/${variety.id}`)
                .set('Cookie', cookie).send({ ...params, genusId: faker.random.uuid() });

            await variety.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(variety)));
        });
    });

    describe('does not update variety', () => {
        it('does not update variety with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${variety.id}`).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('does not update variety with non admin user', async () => {
            // TODO
        });

        it('does not update variety that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send({ ...params, name: 'inexistent' });

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Variety does not exist');
        });

        it('does not update variety with existing name', async () => {
            await createVariety(params);
            const res = await request(app).put(`${route}/${variety.id}`).set('Cookie', cookie).send(params);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Variety already exists');
        });

        it('does not update variety with invalid exposure', async () => {
            const res = await request(app).put(`${route}/${variety.id}`)
                .set('Cookie', cookie).send({ ...params, exposure: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });

        it('does not update variety with invalid watering', async () => {
            const res = await request(app).put(`${route}/${variety.id}`)
                .set('Cookie', cookie).send({ ...params, watering: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });

        it('does not update variety with invalid seed', async () => {
            // TODO: implement rules
        });

        it('does not update variety with invalid plant', async () => {
            // TODO: implement rules
        });

        it('does not update variety with invalid harvest', async () => {
            // TODO: implement rules
        });
    });
});
