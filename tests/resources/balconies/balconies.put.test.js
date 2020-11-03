import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../../factories/auth.factory';
import createBalcony from '../../factories/balcony.factory';

const { Balcony } = db;
const route = '/balconies';

describe('Balconies PUT', () => {
    let cookie;
    let balconyId;
    let params;
    beforeEach(async (done) => {
        ({ cookie, balconyId } = await auth());
        params = { width: faker.random.number(), height: faker.random.number() };
        done();
    });

    describe('updates balcony', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${balconyId}`)
                .set('Cookie', cookie).send(params);

            const balcony = await Balcony.findByPk(balconyId);
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(balcony)));
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('does not update balcony', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${balconyId}`).send(params);

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('that does not exist', async () => {
            await Balcony.destroy({ where: { id: balconyId } });
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('Balcony is missing');
            expect(res.statusCode).toEqual(404);
        });

        it('of another user', async () => {
            const { userId } = await auth();
            const other = await createBalcony({ userId });
            const res = await request(app).put(`${route}/${other.id}`)
                .set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('You cannot edit this balcony');
            expect(res.statusCode).toEqual(401);
        });

        it('with invalid width', async () => {
            const res = await request(app).put(`${route}/${balconyId}`)
                .set('Cookie', cookie).send({ ...params, width: -100 });

            expect(res.body.message).toEqual('"width" must be a positive number');
            expect(res.statusCode).toEqual(400);
        });
    });
});
