import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';
import createPlant from '../../factories/plant.factory';
import createPlanter from '../../factories/planter.factory';
import createUser from '../../factories/user.factory';
import createPlanting from '../../factories/planting.factory';

const { Planting } = db;
const route = '/plantings';

describe('Plantings DELETE', () => {
    let cookie;
    let userId;
    let variety;
    let plant;
    let planter;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth({ username: 'plantings.delete' }));
        const genus = await createGenus({ name: 'plantings.delete' });
        variety = await createVariety({ name: 'plantings.delete', genusId: genus.id });
        plant = await createPlant({ userId, varietyId: variety.id });
        planter = await createPlanter({ userId });
        done();
    });

    let planting;
    beforeEach(async (done) => {
        planting = await createPlanting({ plantId: plant.id, planterId: planter.id });
        done();
    });

    it('deletes planting', async () => {
        const res = await request(app).delete(`${route}/${planting.id}`)
            .set('Cookie', cookie).send();

        expect(res.statusCode).toEqual(200);
        planting = await Planting.findByPk(planting.id);
        expect(planting).toBe(null);
    });

    describe('does not delete planting', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).delete(`${route}/${planting.id}`).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('that does not exist', async () => {
            const res = await request(app).delete(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send();

            expect(res.body.message).toEqual('Planting does not exist');
            expect(res.statusCode).toEqual(404);
        });

        it('that belongs to another user', async () => {
            const user = await createUser();
            const planter2 = await createPlanter({ userId: user.id });
            const target = await createPlanting({ plantId: plant.id, planterId: planter2.id });

            const res = await request(app).delete(`${route}/${target.id}`)
                .set('Cookie', cookie).send();

            expect(res.body.message).toEqual('You cannot delete this planting');
            expect(res.statusCode).toEqual(401);
        });
    });
});
