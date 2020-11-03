import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import { ROLE_ADMIN } from '@/constants';
import auth from '../../factories/auth.factory';
import createVariety from '../../factories/variety.factory';
import createGenus from '../../factories/genus.factory';

const { Variety } = db;
const route = '/varieties';

describe('Varieties GET', () => {
    let cookie;
    let genus;
    beforeAll(async (done) => {
        ({ cookie } = await auth({ username: 'varieties.get', role: ROLE_ADMIN }));
        await Variety.destroy({ where: {} });
        genus = await createGenus({ name: 'varieties.get' });
        done();
    });

    describe('lists', () => {
        let variety1;
        let variety2;

        beforeAll(async (done) => {
            variety1 = await createVariety({ name: 'listVarietiesZ', genusId: genus.id });
            variety2 = await createVariety({ name: 'listVarietiesA', genusId: genus.id });
            done();
        });

        it('all varieties', async () => {
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.body).toEqual(JSON.parse(JSON.stringify([variety2, variety1])));
            expect(res.statusCode).toEqual(200);
        });

        it('varieties by genus', async () => {
            const newGenus = await createGenus({ name: 'byVariety' });
            const newVariety = await createVariety({ genusId: newGenus.id });
            const res = await request(app).get(`${route}?genusId=${newGenus.id}`)
                .set('Cookie', cookie).send();

            expect(res.body).toEqual(JSON.parse(JSON.stringify([newVariety])));
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('does not list varieties', () => {
        it('when genus does not exist', async () => {
            await createVariety({ genusId: genus.id });
            const res = await request(app).get(`${route}?genusId=${faker.random.uuid()}`)
                .set('Cookie', cookie).send();

            expect(res.body.message).toEqual('Genus does not exist');
            expect(res.statusCode).toEqual(404);
        });

        it('when user is not authenticated', async () => {
            const res = await request(app).get(route).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });
    });
});
