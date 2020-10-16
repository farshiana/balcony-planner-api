import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import auth from '../../factories/auth.factory';
import createPlant from '../../factories/plant.factory';

const route = '/plants';

describe('Plants PUT', () => {
    let cookie;
    let userId;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth());
        done();
    });

    let params;
    let plant;
    beforeEach(async (done) => {
        params = { notes: faker.lorem.sentences() };
        plant = await createPlant({ userId });
        done();
    });

    describe('updates plant', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${plant.id}`)
                .set('Cookie', cookie).send(params);

            await plant.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(plant)));
            expect(res.statusCode).toEqual(200);
        });
        // TODO: without trucId x2
    });

    describe('does not update plant', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${plant.id}`).send(params);

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('Plant does not exist');
            expect(res.statusCode).toEqual(404);
        });
    });
});
