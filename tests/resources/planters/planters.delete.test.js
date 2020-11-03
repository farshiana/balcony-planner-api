import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { SHAPES, COLORS, EXPOSURES } from '@/constants';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createPlanter from '../../factories/planter.factory';
import createUser from '../../factories/user.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';
import createPlant from '../../factories/plant.factory';
import createPlanting from '../../factories/planting.factory';

const { Planter, Planting } = db;
const route = '/planters';

describe('Planters DELETE', () => {
    let cookie;
    let userId;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth({ username: 'planters.delete' }));
        done();
    });

    let planter;
    beforeEach(async (done) => {
        planter = await createPlanter({ userId });
        done();
    });

    it('deletes planter and linked planting', async () => {
        const genus = await createGenus({ name: 'linkedPlanting' });
        const variety = await createVariety({ genusId: genus.id });
        const plant = await createPlant({ userId, varietyId: variety.id });
        let planting = await createPlanting({ plantId: plant.id, planterId: planter.id });

        const res = await request(app).delete(`${route}/${planter.id}`)
            .set('Cookie', cookie).send();

        expect(res.statusCode).toEqual(200);
        planter = await Planter.findByPk(planter.id);
        expect(planter).toBe(null);
        planting = await Planting.findByPk(planting.id);
        expect(planting).toBe(null);
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
