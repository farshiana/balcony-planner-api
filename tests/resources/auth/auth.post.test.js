import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { ROLE_USER } from '@/constants';
import db from '@/models/models';
import auth from '../../factories/auth.factory';

const { User } = db;

describe('Auth POST', () => {
    let params;
    beforeEach(() => {
        params = {
            username: faker.name.firstName(),
            password: faker.internet.password(),
        };
    });

    describe('registers user', () => {
        const route = '/auth/register';

        it('with balcony', async () => {
            const res = await request(app).post(route).send(params);
            const user = await User.findByPk(res.body.id);
            const balcony = await user.getBalcony();

            expect(res.body).toEqual({
                username: params.username.toLowerCase(),
                role: ROLE_USER,
                id: user.id,
                balcony: JSON.parse(JSON.stringify(balcony)),
            });
            expect(res.body).toHaveProperty('username', user.username);
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('does not register user', () => {
        const route = '/auth/register';

        it('with existing username', async () => {
            await auth(params);
            const res = await request(app).post(route).send(params);

            expect(res.body.message).toEqual('Username already exists');
            expect(res.statusCode).toEqual(400);
        });

        it('with short password', async () => {
            const res = await request(app).post(route).send({
                username: faker.name.firstName(),
                password: 'short',
            });

            expect(res.body.message).toEqual('"password" length must be at least 12 characters long');
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('logs user out', () => {
        const route = '/auth/logout';

        it('when user is authenticated', async () => {
            const { cookie } = await auth();
            const res = await request(app).post(route).set('Cookie', cookie).send();

            expect(res.statusCode).toEqual(200);
            expect(res.headers['set-cookie']).not.toBeDefined();
        });
    });

    describe('does not log user out', () => {
        const route = '/auth/logout';

        it('when user is not authenticated', async () => {
            const res = await request(app).post(route).send();

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });
    });
});
