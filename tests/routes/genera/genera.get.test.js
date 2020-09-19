import request from 'supertest';
import app from '@/server';
import auth from '../../factories/auth.factory';
import createGenus from '../../factories/genus.factory';

const route = '/genera';

describe('Genera GET', () => {
    let cookie;
    beforeAll(async () => {
        ({ cookie } = await auth());
    });

    describe('returns', () => {
        it('all genera', async () => {
            const genus1 = await createGenus();
            const genus2 = await createGenus();
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(JSON.parse(JSON.stringify([genus1, genus2])));
        });
    });
});
