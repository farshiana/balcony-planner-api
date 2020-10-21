import request from 'supertest';
import app from '@/server';
import auth from '../../factories/auth.factory';
import createPlant from '../../factories/plant.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';

const route = '/plants';

describe('Plants GET', () => {
    let cookie;
    let userId;
    let variety;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth());
        const genus = await createGenus();
        variety = await createVariety({ genusId: genus.id });
        done();
    });

    describe('lists', () => {
        it('all plants', async () => {
            const params = { userId, varietyId: variety.id };
            const plant1 = await createPlant(params);
            const plant2 = await createPlant(params);
            const res = await request(app).get(route).set('Cookie', cookie).send();

            // TODO: fix
            expect(res.body).toEqual(JSON.parse(JSON.stringify([plant1, plant2])));
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
