import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { ROLE_ADMIN } from '@/constants';
import auth from '../../factories/auth.factory';

const route = '/images';

describe('Images POST', () => {
    let cookie;
    beforeAll(async (done) => {
        ({ cookie } = await auth({ username: 'images.post', role: ROLE_ADMIN }));
        done();
    });

    let params;
    beforeEach(() => {
        params = { file: faker.random.word().toLowerCase() };
    });

    it('creates image', async () => {
        const res = await request(app).post(route).set('Cookie', cookie).send(params);

        expect(res.body).toEqual({ url: 'uploaded-url' });
        expect(res.statusCode).toEqual(201);
    });
});
