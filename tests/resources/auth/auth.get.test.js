import request from 'supertest';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';

const { User, Balcony } = db;
const route = '/auth/current';

describe('Auth GET', () => {
    describe('returns current user', () => {
        it('when authenticated', async () => {
            const { cookie, userId } = await auth();
            const res = await request(app).get(route).set('Cookie', cookie).send();

            const user = await User.findByPk(userId, { include: [{ model: Balcony, as: 'balcony' }] });
            expect(res.body).toEqual({
                id: user.id,
                role: user.role,
                username: user.username,
                balcony: JSON.parse(JSON.stringify(user.balcony)),
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('does not return current user', () => {
        it('when not authenticated', async () => {
            const res = await request(app).get(route).send();

            expect(res.body).toEqual({ message: 'Authentication is required' });
            expect(res.statusCode).toEqual(401);
        });
    });
});
