import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import { SHAPES, COLORS, EXPOSURES } from '@/constants';
import auth from '../../factories/auth.factory';
import createPlanter from '../../factories/planter.factory';

const route = '/planters';

describe('Planters PUT', () => {
    let cookie;
    beforeAll(async () => {
        ({ cookie } = await auth());
    });

    let params;
    let planter;
    beforeEach(async () => {
        params = {
            name: faker.lorem.word(),
            shape: SHAPES[1],
            dimensions: { radius: faker.random.number() },
            color: COLORS[1],
            exposure: EXPOSURES[1],
        };
        planter = await createPlanter();
    });

    describe('updates planter', () => {
        it('with params', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(200);

            await planter.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(planter)));
        });
    });

    describe('does not update planter', () => {
        it('with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${planter.id}`).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send({ ...params, notes: 'inexistent' });

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Planter does not exist');
        });

        it('that belongs to another user', async () => {
            const other = await createPlanter();
            const res = await request(app).put(`${route}/${other.id}`)
                .set('Cookie', cookie).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('You cannot edit this planter');
        });

        it('with invalid shape', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send({ ...params, shape: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });

        it('with invalid width', async () => {
            // TODO: implement rules
        });

        it('with invalid color', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send({ ...params, color: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });

        it('with invalid exposure', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send({ ...params, exposure: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });
    });
});
