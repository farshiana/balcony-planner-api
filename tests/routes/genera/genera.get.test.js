import request from 'supertest';
import app from '@/server';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';

const route = '/genera';

describe('Genera GET', () => {
    let cookie;
    beforeAll(async (done) => {
        ({ cookie } = await auth());
        done();
    });

    describe('lists', () => {
        it('all genera', async () => {
            const genus1 = await createGenus();
            const genus2 = await createGenus();
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.body).toEqual(JSON.parse(JSON.stringify([genus1, genus2])));
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
