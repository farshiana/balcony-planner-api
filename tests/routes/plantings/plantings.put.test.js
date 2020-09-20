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
    beforeAll(async () => {
        ({ cookie, userId } = await auth());
    });

    let params;
    let planting;
    beforeEach(async () => {
        const genus = await createGenus();
        const variety = await createVariety({ genusId: genus.id });
        const planter = await createPlanter({ userId });
        params = {
            seed: [0, 1, 2],
            plant: [3, 4, 5],
            harvest: [6, 7, 8],
            varietyId: variety.id,
            planterId: planter.id,
        };
        planting = await createPlanting({ varietyId: variety.id, planterId: planter.id });
    });

    describe('updates planting', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${planting.id}`)
                .set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(200);

            await planting.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(planting)));
        });

        it('without changing varietyId', async () => {
            const res = await request(app).put(`${route}/${planting.id}`)
                .set('Cookie', cookie).send({ ...params, varietyId: faker.random.uuid() });

            await planting.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(planting)));
        });

        it('without changing planterId', async () => {
            const res = await request(app).put(`${route}/${planting.id}`)
                .set('Cookie', cookie).send({ ...params, planterId: faker.random.uuid() });

            await planting.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(planting)));
        });
    });

    describe('does not update planting', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${planting.id}`).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send({ ...params, notes: 'inexistent' });

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Planting does not exist');
        });

        it('that belongs to another user', async () => {
            const user = await createUser();
            const planter = await createPlanter({ userId: user.id });
            const target = await createPlanting({ planterId: planter.id });

            const res = await request(app).put(`${route}/${target.id}`)
                .set('Cookie', cookie).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('You cannot edit this planting');
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
