import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createPlant from '../../factories/plant.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';

const { Plant } = db;
const route = '/plants';

describe('Plants PUT', () => {
    let cookie;
    let userId;
    let variety;
    beforeAll(async () => {
        ({ cookie, userId } = await auth());
        const genus = await createGenus();
        variety = await createVariety({ genusId: genus.id });
    });

    let params;
    let plant;
    beforeEach(async () => {
        params = { notes: faker.lorem.sentences() };
        plant = await createPlant({ userId });
    });

    describe('updates plant', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${plant.id}`)
                .set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(200);

            await plant.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(plant)));
        });
        // TODO: without trucId x2
    });

    describe('does not update plant', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${plant.id}`).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send({ ...params, notes: 'inexistent' });

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Plant does not exist');
        });
    });
});
