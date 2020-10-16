import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { EXPOSURES, WATERINGS } from '@/constants';
import auth from '../../factories/auth.factory';
import createVariety from '../../factories/variety.factory';

const route = '/varieties';

describe('Varieties PUT', () => {
    let cookie;
    beforeAll(async (done) => {
        ({ cookie } = await auth());
        done();
    });

    let params;
    let variety;
    beforeEach(async (done) => {
        params = {
            name: faker.lorem.word(),
            exposure: EXPOSURES[1],
            watering: WATERINGS[1],
            seed: [0, 1, 2],
            plant: [3, 4, 5],
            harvest: [6, 7, 8],
        };
        variety = await createVariety();
        done();
    });

    describe('updates variety', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${variety.id}`)
                .set('Cookie', cookie).send(params);

            await variety.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(variety)));
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('does not update variety', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${variety.id}`).send(params);

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('with non admin user', async () => {
            // TODO
        });

        it('that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send({ ...params, name: 'inexistent' });

            expect(res.body.message).toEqual('Variety does not exist');
            expect(res.statusCode).toEqual(404);
        });

        it('with existing name', async () => {
            await createVariety(params);
            const res = await request(app).put(`${route}/${variety.id}`).set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('Variety already exists');
            expect(res.statusCode).toEqual(400);
        });

        it('with invalid exposure', async () => {
            const res = await request(app).put(`${route}/${variety.id}`)
                .set('Cookie', cookie).send({ ...params, exposure: 'invalid' });

            // expect(res.body.message).toEqual(''); TODO: custom message
            expect(res.statusCode).toEqual(400);
        });

        it('with invalid watering', async () => {
            const res = await request(app).put(`${route}/${variety.id}`)
                .set('Cookie', cookie).send({ ...params, watering: 'invalid' });

            // expect(res.body.message).toEqual(''); TODO: custom message
            expect(res.statusCode).toEqual(400);
        });

        it('with genusId', async () => {
            const res = await request(app).put(`${route}/${variety.id}`)
                .set('Cookie', cookie).send({ ...params, genusId: faker.random.uuid() });

            expect(res.body.message).toEqual('"genusId" is not allowed');
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
