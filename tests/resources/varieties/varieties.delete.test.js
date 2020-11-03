import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import { ROLE_ADMIN } from '@/constants';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';
import createPlant from '../../factories/plant.factory';

const { Variety, Plant } = db;
const route = '/varieties';

describe('Varieties DELETE', () => {
    let cookie;
    let userId;
    let genus;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth({ username: 'varieties.delete', role: ROLE_ADMIN }));
        genus = await createGenus({ name: 'varieties.delete' });
        done();
    });

    let variety;
    beforeEach(async (done) => {
        variety = await createVariety({ genusId: genus.id });
        done();
    });

    it('deletes variety and linked plant', async () => {
        let plant = await createPlant({ userId, varietyId: variety.id });
        const res = await request(app).delete(`${route}/${variety.id}`)
            .set('Cookie', cookie).send();

        expect(res.statusCode).toEqual(200);
        variety = await Variety.findByPk(variety.id);
        expect(variety).toBe(null);
        plant = await Plant.findByPk(plant.id);
        expect(plant).toBe(null);
    });

    describe('does not delete variety', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).delete(`${route}/${variety.id}`).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('that does not exist', async () => {
            const res = await request(app).delete(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send();

            expect(res.body.message).toEqual('Variety does not exist');
            expect(res.statusCode).toEqual(404);
        });
    });
});
