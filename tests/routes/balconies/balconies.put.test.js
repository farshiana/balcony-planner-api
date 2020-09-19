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
    let balcony;
    let params;
    beforeEach(async () => {
        ({ cookie, balconyId } = await auth());
        balcony = await Balcony.findByPk(balconyId);
        params = { width: faker.random.number(), height: faker.random.number() };
    });

    describe('updates balcony', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${balcony.id}`)
                .set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(200);

            await balcony.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(balcony)));
        });
    });

    describe('does not update balcony', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${balcony.id}`).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('You cannot edit this balcony');
        });

        it('of another user', async () => {
            const other = await createBalcony();
            const res = await request(app).put(`${route}/${other.id}`)
                .set('Cookie', cookie).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('You cannot edit this balcony');
        });

        it('with invalid width', async () => {
            const res = await request(app).put(`${route}/${balcony.id}`)
                .set('Cookie', cookie).send({ ...params, width: -100 });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });
    });
});
