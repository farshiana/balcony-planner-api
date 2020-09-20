import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';
import createPlanter from '../../factories/planter.factory';
import createUser from '../../factories/user.factory';
import createPlanting from '../../factories/planting.factory';

const route = '/plantings';

describe('Plantings PUT', () => {
    let cookie;
    let userId;
    let variety;
    let planter;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth());
        const genus = await createGenus();
        variety = await createVariety({ genusId: genus.id });
        planter = await createPlanter({ userId });
        done();
    });

    let params;
    let planting;
    beforeEach(async (done) => {
        params = {
            seed: [0, 1, 2],
            plant: [3, 4, 5],
            harvest: [6, 7, 8],
        };
        planting = await createPlanting({ varietyId: variety.id, planterId: planter.id });
        done();
    });

    describe('updates planting', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${planting.id}`)
                .set('Cookie', cookie).send(params);

            await planting.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(planting)));
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('does not update planting', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${planting.id}`).send(params);

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('Planting does not exist');
            expect(res.statusCode).toEqual(404);
        });

        it('that belongs to another user', async () => {
            const user = await createUser();
            const planter2 = await createPlanter({ userId: user.id });
            const target = await createPlanting({ planterId: planter2.id });

            const res = await request(app).put(`${route}/${target.id}`)
                .set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('You cannot edit this planting');
            expect(res.statusCode).toEqual(401);
        });

        it('with varietyId', async () => {
            const res = await request(app).put(`${route}/${planting.id}`)
                .set('Cookie', cookie).send({ ...params, varietyId: faker.random.uuid() });

            expect(res.body.message).toEqual('"varietyId" is not allowed');
            expect(res.statusCode).toEqual(400);
        });

        it('with planterId', async () => {
            const res = await request(app).put(`${route}/${planting.id}`)
                .set('Cookie', cookie).send({ ...params, planterId: faker.random.uuid() });

            expect(res.body.message).toEqual('"planterId" is not allowed');
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
