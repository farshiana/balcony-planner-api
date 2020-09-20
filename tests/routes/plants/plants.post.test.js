import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';

const { Plant } = db;
const route = '/plants';

describe('Plants POST', () => {
    let cookie;
    let variety;
    beforeAll(async (done) => {
        ({ cookie } = await auth());
        const genus = await createGenus();
        variety = await createVariety({ genusId: genus.id });
        done();
    });

    let params;
    beforeEach(() => {
        params = { varietyId: variety.id, notes: faker.lorem.sentences() };
    });

    describe('creates plant', () => {
        it('with params', async () => {
            const res = await request(app).post(route).set('Cookie', cookie).send(params);

            const plant = await Plant.findByPk(res.body.id);
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(plant)));
            expect(res.statusCode).toEqual(201);
        });
    });

    describe('does not create plant', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).post(route).send(params);

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('that already exists', async () => {
            // TODO: index + check
        });

        it('with variety that does not exist', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, varietyId: faker.random.uuid() });

            expect(res.body.message).toEqual('Variety does not exist');
            expect(res.statusCode).toEqual(404);
        });
    });
});
