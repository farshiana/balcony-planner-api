import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';
import auth from '../factories/auth.factory';
import createBalcony from '../factories/balcony.factory';

const { Balcony } = db;
const route = '/balconies';

describe(route, () => {
    let cookie; let
        balconyId;
    beforeAll(async () => {
        ({ cookie, balconyId } = await auth());
    });

    describe('update', () => {
        const params = {
            width: faker.random.number(),
            height: faker.random.number(),
        };
        let balcony;
        beforeAll(async () => {
            balcony = await Balcony.findByPk(balconyId);
        });

        it('updates balcony', async () => {
            const res = await request(app).put(`${route}/${balcony.id}`)
                .set('Cookie', cookie).send(params);
            expect(res.statusCode).toEqual(200);

            await balcony.reload();
            expect(res.body).toMatchObject(params);
            expect(res.body).toEqual(JSON.parse(JSON.stringify(balcony)));
        });

        it('does not update balcony that does not exist', async () => {
            const res = await request(app).put(`${route}/${faker.random.uuid()}`)
                .set('Cookie', cookie).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('You cannot edit this balcony');
        });

        it('does not update balcony that belongs to another user', async () => {
            const other = await createBalcony();
            const res = await request(app).put(`${route}/${other.id}`)
                .set('Cookie', cookie).send(params);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('You cannot edit this balcony');
        });

        it('does not update balcony with negative width', async () => {
            const res = await request(app).put(`${route}/${balcony.id}`)
                .set('Cookie', cookie).send({ ...params, width: -100 });

            expect(res.statusCode).toEqual(400);
            // expect(res.body.message).toEqual(''); TODO: custom message
        });
    });
});
