import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';

const { Genus } = db;
const route = '/genera';

describe('Genera DELETE', () => {
    let cookie;
    beforeAll(async (done) => {
        ({ cookie } = await auth());
        done();
    });

    let genus;
    beforeEach(async (done) => {
        genus = await createGenus();
        done();
    });

    it('deletes genus', async () => {
        const res = await request(app).delete(`${route}/${genus.id}`)
            .set('Cookie', cookie).send();

        const deleted = await Genus.findByPk(genus.id);
        expect(deleted).toBe(null);
        expect(res.statusCode).toEqual(204);
    });

    describe('does not delete genus', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).delete(`${route}/${genus.id}`).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('with non admin user', async () => {
            // TODO
        });

        it('that does not exist', async () => {
            const res = await request(app).delete(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send();

            expect(res.body.message).toEqual('Genus does not exist');
            expect(res.statusCode).toEqual(404);
        });
    });
});
