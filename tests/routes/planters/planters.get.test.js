import request from 'supertest';
import app from '@/server';
import auth from '../../factories/auth.factory';
import createPlanter from '../../factories/planter.factory';

const route = '/planters';

describe('Planters GET', () => {
    let cookie;
    beforeAll(async () => {
        ({ cookie } = await auth());
    });

    describe('lists', () => {
        let planter1;
        let planter2;

        beforeAll(async () => {
            planter1 = await createPlanter();
            planter2 = await createPlanter();
        });

        it('all planters', async () => {
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(JSON.parse(JSON.stringify([planter1, planter2])));
        });
    });

    describe('does not list planters', () => {
        it('when user is not authenticated', async () => {
            const res = await request(app).get(route).send();

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });
    });
});
