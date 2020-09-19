import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import auth from '../../factories/auth.factory';
import createVariety from '../../factories/variety.factory';
import createGenus from '../../factories/genus.factory';

const route = '/varieties';

describe('Varieties GET', () => {
    let cookie;
    let genus;
    beforeAll(async () => {
        ({ cookie } = await auth());
        genus = await createGenus();
    });

    describe('lists', () => {
        let variety1;
        let variety2;

        beforeAll(async () => {
            variety1 = await createVariety({ genusId: genus.id });
            variety2 = await createVariety({ genusId: genus.id });
        });

        it('all varieties', async () => {
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(JSON.parse(JSON.stringify([variety1, variety2])));
        });

        it('varieties by genus', async () => {
            await createVariety();
            const res = await request(app).get(`${route}?genusId=${genus.id}`)
                .set('Cookie', cookie).send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(JSON.parse(JSON.stringify([variety1, variety2])));
        });
    });

    describe('does not list varieties', () => {
        it('when genus does not exist', async () => {
            await createVariety();
            const res = await request(app).get(`${route}?genusId=${faker.random.uuid()}`)
                .set('Cookie', cookie).send();

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Genus does not exist');
        });

        it('when user is not authenticated', async () => {
            const res = await request(app).get(route).send();

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });
    });
});
