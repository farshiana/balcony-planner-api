import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import { SHAPES, COLORS, EXPOSURES } from '@/constants';
import auth from '../factories/auth.factory';
import createPlanter from '../factories/planter.factory';

const { Planter } = db;
const route = '/planters';

describe(route, () => {
    let cookie;
    beforeAll(async () => {
        ({ cookie } = await auth());
    });

    describe('index', () => {
        it('returns all planters', async () => {
            const planter1 = await createPlanter();
            const planter2 = await createPlanter();
            const res = await request(app).get(route).set('Cookie', cookie).send();

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(JSON.parse(JSON.stringify([planter1, planter2])));
        });
    });

    describe('create', () => {
        const params = {
            name: faker.lorem.word(),
            shape: SHAPES[1],
            dimensions: { radius: faker.random.number() },
            color: COLORS[1],
            exposure: EXPOSURES[1],
        };

        it('creates planter', async () => {
            const res = await request(app).post(route).set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(201);

            const planter = await Planter.findByPk(res.body.id);
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(planter)));
        });

        it('does not create planter with unauthenticated user', async () => {
            const res = await request(app).post(route).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('does not create planter with invalid shape', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, shape: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });

        it('does not create planter with invalid width', async () => {
            // TODO: implement rules
        });

        it('does not create planter with invalid color', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, color: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });

        it('does not create planter with invalid exposure', async () => {
            const res = await request(app).post(route)
                .set('Cookie', cookie).send({ ...params, exposure: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });
    });

    describe('update', () => {
        const params = { notes: faker.lorem.sentences() };
        let planter;
        beforeAll(async () => {
            planter = await createPlanter();
        });

        it('updates planter', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(200);

            await planter.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(planter)));
        });

        it('does not update planter with unauthenticated user', async () => {
            const res = await request(app).put(`${route}/${planter.id}`).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Authentication is required');
        });

        it('does not update planter that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send({ ...params, notes: 'inexistent' });

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Planter does not exist');
        });

        it('does not update planter that belongs to another user', async () => {
            const other = await createPlanter();
            const res = await request(app).put(`${route}/${other.id}`)
                .set('Cookie', cookie).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('You cannot edit this planter');
        });

        it('does not update planter with invalid shape', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send({ ...params, shape: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });

        it('does not update planter with invalid width', async () => {
            // TODO: implement rules
        });

        it('does not update planter with invalid color', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send({ ...params, color: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });

        it('does not update planter with invalid exposure', async () => {
            const res = await request(app).put(`${route}/${planter.id}`)
                .set('Cookie', cookie).send({ ...params, exposure: 'invalid' });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });
    });
});
