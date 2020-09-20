import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { SHAPES, COLORS, EXPOSURES } from '@/constants';
import auth from '../../factories/auth.factory';
import createPlanter from '../../factories/planter.factory';
import createUser from '../../factories/user.factory';

const route = '/planters';

describe('Planters PUT', () => {
    let cookie;
    let userId;
    beforeAll(async (done) => {
        ({ cookie, userId } = await auth());
        done();
    });

    let params;
    let planter;
    beforeEach(async (done) => {
        params = {
            name: faker.lorem.word(),
            shape: SHAPES[1],
            dimensions: { radius: faker.random.number() },
            color: COLORS[1],
            exposure: EXPOSURES[1],
        };
        planter = await createPlanter({ userId });
        done();
    });

    describe('updates planter', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send(params);

            await planter.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(planter)));
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('does not update planter', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${planter.id}`).send(params);

            expect(res.body.message).toEqual('Authentication is required');
            expect(res.statusCode).toEqual(401);
        });

        it('that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('Planter does not exist');
            expect(res.statusCode).toEqual(404);
        });

        it('that belongs to another user', async () => {
            const user = await createUser();
            const target = await user.createPlanter({ ...params }); // copy object as Sequelize updates it...
            const res = await request(app).put(`${route}/${target.id}`)
                .set('Cookie', cookie).send(params);

            expect(res.body.message).toEqual('You cannot edit this planter');
            expect(res.statusCode).toEqual(401);
        });

        it('with invalid shape', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send({ ...params, shape: 'invalid' });

            // expect(res.body.message).toEqual(''); TODO: custom message
            expect(res.statusCode).toEqual(400);
        });

        it('with invalid width', async () => {
            // TODO: implement rules
        });

        it('with invalid color', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send({ ...params, color: 'invalid' });

            // expect(res.body.message).toEqual(''); TODO: custom message
            expect(res.statusCode).toEqual(400);
        });

        it('with invalid exposure', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send({ ...params, exposure: 'invalid' });

            // expect(res.body.message).toEqual(''); TODO: custom message
            expect(res.statusCode).toEqual(400);
        });
    });
});
