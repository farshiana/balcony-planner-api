import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { SHAPES, COLORS, EXPOSURES } from '@/constants';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createPlanter from '../../factories/planter.factory';
import createUser from '../../factories/user.factory';

const { Planter } = db;
const route = '/planters';

describe('Planters DELETE', () => {
    let cookie;
    let userId;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth());
        done();
    });

    let planter;
    beforeEach(async (done) => {
        planter = await createPlanter({ userId });
        done();
    });

    it('deletes planter', async () => {
        const res = await request(app).delete(`${route}/${planter.id}`)
            .set('Cookie', cookie).send();

        const deleted = await Planter.findByPk(planter.id);
        expect(deleted).toBe(null);
        expect(res.statusCode).toEqual(204);
    });

    describe('does not delete planter', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).delete(`${route}/${planter.id}`).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('that does not exist', async () => {
            const res = await request(app).delete(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send();

            expect(res.body.message).toEqual('Planter does not exist');
            expect(res.statusCode).toEqual(404);
        });

        it('that belongs to another user', async () => {
            const user = await createUser();
            const target = await user.createPlanter({
                name: faker.random.word(),
                shape: SHAPES[1],
                position: { left: faker.random.number(), top: faker.random.number() },
                dimensions: { width: faker.random.number() },
                color: COLORS[1],
                exposure: EXPOSURES[1],
            });
            const res = await request(app).delete(`${route}/${target.id}`)
                .set('Cookie', cookie).send();

            expect(res.body.message).toEqual('You cannot delete this planter');
            expect(res.statusCode).toEqual(401);
        });
    });
});
