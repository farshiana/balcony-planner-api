import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';

const { Variety } = db;
const route = '/varieties';

describe('Varieties DELETE', () => {
    let cookie;
    beforeAll(async (done) => {
        ({ cookie } = await auth());
        done();
    });

    let variety;
    beforeEach(async (done) => {
        const genus = await createGenus();
        variety = await createVariety({ genusId: genus.id });
        done();
    });

    it('deletes variety', async () => {
        const res = await request(app).delete(`${route}/${variety.id}`)
            .set('Cookie', cookie).send();

        const deleted = await Variety.findByPk(variety.id);
        expect(deleted).toBe(null);
        expect(res.statusCode).toEqual(204);
    });

    describe('does not delete variety', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).delete(`${route}/${variety.id}`).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('with non admin user', async () => {
            // TODO
        });

        it('that does not exist', async () => {
            const res = await request(app).delete(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send();

            expect(res.body.message).toEqual('Variety does not exist');
            expect(res.statusCode).toEqual(404);
        });
    });
});
