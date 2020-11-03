import request from 'supertest';
import app from '@/server';
import db from '@/models/models';
import { ROLE_ADMIN } from '@/constants';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';

const { Genus } = db;
const route = '/genera';

describe('Genera GET', () => {
    let cookie;
    beforeAll(async (done) => {
        ({ cookie } = await auth({ username: 'genera.get', role: ROLE_ADMIN }));
        await Genus.destroy({ where: {} });
        done();
    });

    describe('lists', () => {
        it('all genera', async () => {
            const genus1 = await createGenus({ name: 'listGeneraZ' });
            const genus2 = await createGenus({ name: 'listGeneraA' });
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.body).toEqual(JSON.parse(JSON.stringify([genus2, genus1])));
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('does not list genera', () => {
        it('when user is not authenticated', async () => {
            const res = await request(app).get(route).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });
    });
});
