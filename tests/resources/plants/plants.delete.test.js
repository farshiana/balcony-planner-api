import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createUser from '../../factories/user.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';
import createPlant from '../../factories/plant.factory';
import createPlanter from '../../factories/planter.factory';
import createPlanting from '../../factories/planting.factory';

const { Plant, Planting } = db;
const route = '/plants';

describe('Plants DELETE', () => {
    let cookie;
    let userId;
    let variety;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth({ username: 'plants.delete' }));
        const genus = await createGenus({ name: 'plants.delete' });
        variety = await createVariety({ genusId: genus.id });
        done();
    });

    let plant;
    beforeEach(async (done) => {
        plant = await createPlant({ userId, varietyId: variety.id });
        done();
    });

    it('deletes plant and linked planting', async () => {
        const planter = await createPlanter({ userId });
        let planting = await createPlanting({ plantId: plant.id, planterId: planter.id });

        const res = await request(app).delete(`${route}/${plant.id}`)
            .set('Cookie', cookie).send();

        expect(res.statusCode).toEqual(200);
        plant = await Plant.findByPk(plant.id);
        expect(plant).toBe(null);
        planting = await Planting.findByPk(planting.id);
        expect(planting).toBe(null);
    });

    describe('does not delete plant', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).delete(`${route}/${plant.id}`).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('that does not exist', async () => {
            const res = await request(app).delete(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send();

            expect(res.body.message).toEqual('Plant does not exist');
            expect(res.statusCode).toEqual(404);
        });

        it('that belongs to another user', async () => {
            const user = await createUser();
            const target = await createPlant({ userId: user.id, varietyId: variety.id });

            const res = await request(app).delete(`${route}/${target.id}`)
                .set('Cookie', cookie).send();

            expect(res.body.message).toEqual('You cannot delete this plant');
            expect(res.statusCode).toEqual(401);
        });
    });
});
