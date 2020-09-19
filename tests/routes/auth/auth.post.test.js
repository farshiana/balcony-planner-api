import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { ROLE_ADMIN } from '@/constants';
import db from '@/models/models';
import auth from '../../factories/auth.factory';

const { User } = db;
const route = '/auth/register';

describe('Auth POST', () => {
    let params;
    beforeEach(() => {
        params = {
            email: faker.internet.exampleEmail(),
            username: faker.name.firstName(),
            password: faker.internet.password(),
        };
    });

    describe('registers user', () => {
        it('with balcony', async () => {
            const res = await request(app).post(route).send(params);
            expect(res.statusCode).toEqual(200);

            const user = await User.findByPk(res.body.id);
            const balcony = await user.getBalcony();

            expect(res.body).toEqual({
                email: params.email.toLowerCase(),
                username: params.username,
                role: ROLE_ADMIN, // TODO: replace with ROLE_USER
                id: user.id,
                balcony: JSON.parse(JSON.stringify(balcony)),
            });
            expect(res.body).toHaveProperty('email', user.email);
            expect(res.body).toHaveProperty('username', user.username);
        });
    });

    describe('does not register user', () => {
        it('with existing username', async () => {
            await auth(params);
            const res = await request(app).post(route).send(params);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Username already exists');
        });

        it('with existing email', async () => {
            await auth({ ...params, username: faker.name.firstName() });
            const res = await request(app).post(route).send(params);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Email already exists');
        });

        it('with short password', async () => {
            const res = await request(app).post(route).send({
                email: faker.internet.exampleEmail(),
                username: faker.name.firstName(),
                password: 'short',
            });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual('Password...'); TODO: send message
        });
    });
});
