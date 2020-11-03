import request from 'supertest';
import app from '@/server';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';
import createPlant from '../../factories/plant.factory';

const route = '/plants';

describe('Plants GET', () => {
    let cookie;
    let userId;
    let genus;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth({ username: 'plants.get' }));
        genus = await createGenus({ name: 'plants.get' });
        done();
    });

    describe('lists', () => {
        it('all plants', async () => {
            const variety1 = await createVariety({ name: 'listPlantsZ', genusId: genus.id });
            const variety2 = await createVariety({ name: 'listPlantsA', genusId: genus.id });

            const plant1 = await createPlant({ userId, varietyId: variety1.id });
            const plant2 = await createPlant({ userId, varietyId: variety2.id });
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.body).toEqual(JSON.parse(JSON.stringify([
                { ...plant2.dataValues, variety: variety2.dataValues },
                { ...plant1.dataValues, variety: variety1.dataValues },
            ])));
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('does not list plants', () => {
        it('when user is not authenticated', async () => {
            const res = await request(app).get(route).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });
    });
});
