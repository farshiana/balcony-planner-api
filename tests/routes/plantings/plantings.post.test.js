import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';
import createPlanter from '../../factories/planter.factory';
import createUser from '../../factories/user.factory';

const { Planting } = db;
const route = '/plantings';

describe('Plantings POST', () => {
    let cookie;
    let userId;
    let variety;
    let planter;
    beforeAll(async () => {
        ({ cookie, userId } = await auth());
        const genus = await createGenus();
        variety = await createVariety({ genusId: genus.id });
        planter = await createPlanter({ userId });
    });

    let params;
    beforeEach(() => {
        params = {
            seed: [0, 1, 2],
            plant: [3, 4, 5],
            harvest: [6, 7, 8],
            varietyId: variety.id,
            planterId: planter.id,
        };
    });

    describe('creates planting', () => {
        it('with params', async () => {
            const res = await request(app).post(route).set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(201);

            const planting = await Planting.findByPk(res.body.id);
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(planting)));
        });
    });

    describe('does not create planting', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).post(route).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('that already exists', async () => {
            // TODO: index + check
        });

        it('with variety that does not exist', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, varietyId: faker.random.uuid() });

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Variety does not exist');
        });

        it('with planter that does not exist', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, planterId: faker.random.uuid() });

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Planter does not exist');
        });

        it('with planter that belongs to another user', async () => {
            const user = await createUser();
            const target = await createPlanter({ userId: user.id });

            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, planterId: target.id });

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('You cannot create this planting');
        });

        it('with invalid seed', async () => {
            // TODO: implement rules
        });

        it('with invalid plant', async () => {
            // TODO: implement rules
        });

        it('with invalid harvest', async () => {
            // TODO: implement rules
        });
    });
});
