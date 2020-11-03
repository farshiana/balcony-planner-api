import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import { ROLE_ADMIN } from '@/constants';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';
import createVariety from '../../factories/variety.factory';

const { Genus, Variety } = db;
const route = '/genera';

describe('Genera DELETE', () => {
    let cookie;
    beforeAll(async (done) => {
        ({ cookie } = await auth({ username: 'genera.delete', role: ROLE_ADMIN }));
        done();
    });

    let genus;
    beforeEach(async (done) => {
        genus = await createGenus();
        done();
    });

    it('deletes genus and linked variety', async () => {
        let variety = await createVariety({ genusId: genus.id });
        const res = await request(app).delete(`${route}/${genus.id}`)
            .set('Cookie', cookie).send();

        expect(res.statusCode).toEqual(200);
        genus = await Genus.findByPk(genus.id);
        expect(genus).toBe(null);
        variety = await Variety.findByPk(variety.id);
        expect(variety).toBe(null);
    });

    describe('does not delete genus', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).delete(`${route}/${genus.id}`).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('that does not exist', async () => {
            const res = await request(app).delete(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send();

            expect(res.body.message).toEqual('Genus does not exist');
            expect(res.statusCode).toEqual(404);
        });
    });
});
