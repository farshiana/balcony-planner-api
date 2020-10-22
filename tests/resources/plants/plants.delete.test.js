import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createUser from '../../factories/user.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';
import createPlant from '../../factories/plant.factory';

const { Plant } = db;
const route = '/plants';

describe('Plants DELETE', () => {
    let cookie;
    let userId;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth());
        done();
    });

    let variety;
    let plant;
    beforeEach(async (done) => {
        const genus = await createGenus();
        variety = await createVariety({ genusId: genus.id });
        plant = await createPlant({ userId, varietyId: variety.id });
        done();
    });

    it('deletes plant', async () => {
        const res = await request(app).delete(`${route}/${plant.id}`)
            .set('Cookie', cookie).send();

        const deleted = await Plant.findByPk(plant.id);
        expect(deleted).toBe(null);
        expect(res.statusCode).toEqual(204);
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
