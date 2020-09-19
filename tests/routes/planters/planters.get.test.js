import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import { SHAPES, COLORS, EXPOSURES } from '@/constants';
import auth from '../../factories/auth.factory';

const { User } = db;
const route = '/planters';

describe('Planters GET', () => {
    let cookie;
    let userId;
    let user;
    beforeAll(async () => {
        ({ cookie, userId } = await auth());
        user = await User.findByPk(userId);
    });

    describe('lists', () => {
        it('all planters', async () => {
            const params = {
                name: faker.lorem.word(),
                shape: SHAPES[0],
                dimensions: { radius: faker.random.number() },
                color: COLORS[0],
                exposure: EXPOSURES[0],
            };
            const planter1 = await user.createPlanter(params);
            const planter2 = await user.createPlanter(params);
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([
                { ...JSON.parse(JSON.stringify(planter2)), plantings: [] },
                { ...JSON.parse(JSON.stringify(planter1)), plantings: [] },
            ]);
        });
    });

    describe('does not list planters', () => {
        it('when user is not authenticated', async () => {
            const res = await request(app).get(route).send();

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });
    });
});
