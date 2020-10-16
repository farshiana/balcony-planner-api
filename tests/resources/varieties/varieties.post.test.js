import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import { EXPOSURES, WATERINGS } from '@/constants';
import auth from '../../factories/auth.factory';
import createVariety from '../../factories/variety.factory';
import createGenus from '../../factories/genus.factory';

const { Variety } = db;
const route = '/varieties';

describe('Varieties POST', () => {
    let cookie;
    let genus;
    beforeAll(async (done) => {
        ({ cookie } = await auth());
        genus = await createGenus();
        done();
    });

    let params;
    beforeEach(() => {
        params = {
            name: faker.lorem.word(),
            exposure: EXPOSURES[0],
            watering: WATERINGS[0],
            seed: [0, 1, 2],
            plant: [3, 4, 5],
            harvest: [6, 7, 8],
            genusId: genus.id,
        };
    });

    describe('creates variety', () => {
        it('with params', async () => {
            const res = await request(app).post(route).set('Cookie', cookie).send(params);

            const variety = await Variety.findByPk(res.body.id);
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(variety)));
            expect(res.statusCode).toEqual(201);
        });
    });

    describe('does not create variety', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).post(route).send(params);

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('with non admin user', async () => {
            // TODO
        });

        it('with genus that does not exist', async () => {
            const res = await request(app).post(route).set('Cookie', cookie)
                .send({ ...params, name: faker.lorem.word(), genusId: faker.random.uuid() });

            expect(res.body.message).toEqual('Genus does not exist');
            expect(res.statusCode).toEqual(404);
        });

        it('with existing name', async () => {
            await createVariety(params);
            const res = await request(app).post(route).set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('Variety already exists');
            expect(res.statusCode).toEqual(400);
        });

        it('with invalid exposure', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, exposure: 'invalid' });

            // expect(res.body.message).toEqual(''); TODO: custom message
            expect(res.statusCode).toEqual(400);
        });

        it('with invalid watering', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, watering: 'invalid' });

            // expect(res.body.message).toEqual(''); TODO: custom message
            expect(res.statusCode).toEqual(400);
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
