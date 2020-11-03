import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import auth from '../../factories/auth.factory';
import createUser from '../../factories/user.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';
import createPlant from '../../factories/plant.factory';

const route = '/plants';

describe('Plants PUT', () => {
    let cookie;
    let userId;
    let variety;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth({ username: 'plants.put' }));
        const genus = await createGenus({ name: 'plants.put' });
        variety = await createVariety({ genusId: genus.id });
        done();
    });

    let params;
    let plant;
    beforeEach(async (done) => {
        params = { notes: faker.random.word() };
        plant = await createPlant({ userId, varietyId: variety.id });
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

        it('that belongs to another user', async () => {
            const user = await createUser();
            const target = await createPlant({ userId: user.id, varietyId: variety.id });

            const res = await request(app).put(`${route}/${target.id}`)
                .set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('You cannot edit this plant');
            expect(res.statusCode).toEqual(401);
        });
    });
});
