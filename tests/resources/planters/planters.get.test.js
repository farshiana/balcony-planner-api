import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import { SHAPES, COLORS, EXPOSURES } from '@/constants';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';
import createPlant from '../../factories/plant.factory';
import createPlanting from '../../factories/planting.factory';

const { User } = db;
const route = '/planters';

describe('Planters GET', () => {
    let cookie;
    let userId;
    let user;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth({ username: 'planters.get' }));
        user = await User.findByPk(userId);
        done();
    });

    describe('lists', () => {
        it('all planters', async () => {
            const params = {
                name: faker.random.word(),
                shape: SHAPES[0],
                position: { left: faker.random.number(), top: faker.random.number() },
                dimensions: { width: faker.random.number() },
                color: COLORS[0],
                exposure: EXPOSURES[0],
            };
            const planters = await Promise.all([user.createPlanter(params), user.createPlanter(params)]);
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.body).toIncludeSameMembers([
                { ...JSON.parse(JSON.stringify(planters[0])), plantings: [] },
                { ...JSON.parse(JSON.stringify(planters[1])), plantings: [] },
            ]);
            expect(res.statusCode).toEqual(200);
        });

        it('planters with plantings', async () => {
            const params = {
                name: faker.random.word(),
                shape: SHAPES[0],
                position: { left: faker.random.number(), top: faker.random.number() },
                dimensions: { width: faker.random.number() },
                color: COLORS[0],
                exposure: EXPOSURES[0],
            };
            const genus = await createGenus({ name: 'withPlantings' });
            const variety = await createVariety({ genusId: genus.id });
            const planter = await user.createPlanter(params);
            const plant = await createPlant({ userId, varietyId: variety.id });
            const planting = await createPlanting({ plantId: plant.id, planterId: planter.id });
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.body[0]).toEqual({
                ...JSON.parse(JSON.stringify(planter)),
                plantings: [JSON.parse(JSON.stringify(planting))],
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('does not list planters', () => {
        it('when user is not authenticated', async () => {
            const res = await request(app).get(route).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });
    });
});
