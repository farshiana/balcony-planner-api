import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';
import createPlant from '../../factories/plant.factory';
import createPlanter from '../../factories/planter.factory';
import createUser from '../../factories/user.factory';

const { Planting } = db;
const route = '/plantings';

describe('Plantings POST', () => {
    let cookie;
    let userId;
    let variety;
    let plant;
    let planter;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth({ username: 'plantings.post' }));
        const genus = await createGenus({ name: 'plantings.post' });
        variety = await createVariety({ name: 'plantings.post', genusId: genus.id });
        plant = await createPlant({ userId, varietyId: variety.id });
        planter = await createPlanter({ userId });
        done();
    });

    let params;
    beforeEach(() => {
        params = {
            position: { left: faker.random.number(), top: faker.random.number() },
            seed: [0, 1, 2],
            plant: [3, 4, 5],
            harvest: [6, 7, 8],
            plantId: plant.id,
            planterId: planter.id,
        };
    });

    describe('creates planting', () => {
        it('with params', async () => {
            const res = await request(app).post(route).set('Cookie', cookie).send(params);

            const planting = await Planting.findByPk(res.body.id);
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(planting)));
            expect(res.statusCode).toEqual(201);
        });
    });

    describe('does not create planting', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).post(route).send(params);

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('with plant that does not exist', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, plantId: faker.random.uuid() });

            expect(res.body.message).toEqual('Plant does not exist');
            expect(res.statusCode).toEqual(404);
        });

        it('with planter that does not exist', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, planterId: faker.random.uuid() });

            expect(res.body.message).toEqual('Planter does not exist');
            expect(res.statusCode).toEqual(404);
        });

        it('with planter that belongs to another user', async () => {
            const user = await createUser();
            const target = await createPlanter({ userId: user.id });

            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, planterId: target.id });

            expect(res.body.message).toEqual('You cannot create this planting');
            expect(res.statusCode).toEqual(401);
        });
    });
});
