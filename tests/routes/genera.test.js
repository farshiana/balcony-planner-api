import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { CATEGORIES } from '@/constants';
import db from '@/models/models';
import { getCookie } from '../helper';
import getGenus from '../factories/genus.factory';

const { Genus } = db;
const route = '/genera';

describe(route, () => {
    const params = {
        name: faker.lorem.word(),
        category: CATEGORIES[0],
    };

    xdescribe('create', () => {
        it('creates genus', async () => {
            const cookie = await getCookie();
            const res = await request(app).post(route).set('Cookie', [cookie]).send(params);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(params);
        });

        it('does not create genus with unauthenticated user', async () => {
            const res = await request(app).post(route).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('does not create genus with existing name', async () => {
        });

        it('does not create genus with invalid category', async () => {
        });
    });

    describe('index', () => {
        it('returns all genera', async () => {
            const genera = await Promise.all([getGenus(), getGenus()]);

            const cookie = await getCookie();
            const res = await request(app).get(route).set('Cookie', [cookie]).send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([
                { category: CATEGORIES[0], id: genera[0].id, name: genera[0].name },
                { category: CATEGORIES[0], id: genera[1].id, name: genera[1].name },
            ]);
        });
    });
});
