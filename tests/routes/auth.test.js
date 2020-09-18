import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { ROLE_ADMIN } from '@/constants';
import db from '@/models/models';

const { User } = db;
const route = '/auth';

describe(route, () => {
    const params = {
        email: faker.internet.exampleEmail(),
        username: faker.name.firstName(),
        password: faker.internet.password(),
    };

    describe('register', () => {
        it('creates user with balcony', async () => {
            const res = await request(app).post(`${route}/register`).send(params);
            expect(res.statusCode).toEqual(200);

            const user = await User.findByPk(res.body.id);
            const balcony = await user.getBalcony();

            expect(res.body).toEqual({
                email: params.email.toLowerCase(),
                username: params.username,
                role: ROLE_ADMIN, // TODO: replace with ROLE_USER
                id: user.id,
                balcony: balcony.dataValues,
            });
            expect(res.body).toMatchObject(user);
        });

        it('does not register user with existing username', async () => {
            const res = await request(app).post(`${route}/register`).send(params);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Username already exists');
        });

        it('does not register user with existing email', async () => {
            const res = await request(app).post(`${route}/register`).send({
                ...params,
                username: faker.name.firstName(),
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Email already exists');
        });

        it('does not register user with short password', async () => {
            const res = await request(app).post(`${route}/register`).send({
                email: faker.internet.exampleEmail(),
                username: faker.name.firstName(),
                password: 'short',
            });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual('Password...'); TODO: send message
        });
    });

    describe('login', () => {
        it('logs user in and sets cookie', async () => {
            const res = await request(app).put(`${route}/login`).send(params);
            expect(res.statusCode).toEqual(200);

            const cookie = res.headers['set-cookie'];
            expect(cookie[0].includes('connect.sid')).toBeTruthy();
            expect(cookie[0].includes('HttpOnly')).toBeTruthy();
        });

        it('does not log user in with invalid password', async () => {
            const res = await request(app).put(`${route}/login`).send({
                ...params,
                password: 'invalidPassword',
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Password is invalid');
            expect(res.headers['set-cookie']).not.toBeDefined();
        });
    });
});
