import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';

const { User } = db;
const route = '/auth/login';

describe('Auth PUT', () => {
    let params;
    beforeEach(async (done) => {
        params = {
            username: faker.name.firstName(),
            password: faker.internet.password(),
        };
        await auth(params);
        done();
    });

    describe('logs user in', () => {
        it('with cookie', async () => {
            const res = await request(app).put(route).send(params);
            expect(res.statusCode).toEqual(200);

            const cookie = res.headers['set-cookie'];
            expect(cookie[0].includes('connect.sid')).toBeTruthy();
            expect(cookie[0].includes('HttpOnly')).toBeTruthy();
        });
    });

    describe('does not log user in', () => {
        it('with deleted user', async () => {
            await User.destroy({ where: {} });
            const res = await request(app).put(route).send(params);

            expect(res.body.message).toEqual('User does not exist');
            expect(res.statusCode).toEqual(404);
            expect(res.headers['set-cookie']).not.toBeDefined();
        });

        it('with invalid password', async () => {
            const res = await request(app).put(route).send({
                ...params,
                password: 'invalidPassword',
            });

            expect(res.body.message).toEqual('Password is invalid');
            expect(res.statusCode).toEqual(401);
            expect(res.headers['set-cookie']).not.toBeDefined();
        });
    });
});
