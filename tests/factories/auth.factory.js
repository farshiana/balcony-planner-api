import request from 'supertest';
import faker from 'faker';
import app from '@/server';
import db from '@/models/models';

const { User } = db;

export default async (props = {}) => {
    const res = await request(app).post('/auth/register').send({
        username: faker.unique(faker.name.firstName),
        password: faker.internet.password(),
        ...props,
    });
    expect(res.statusCode).toEqual(200);

    if (props.role) {
        const user = await User.findByPk(res.body.id);
        await user.update({ role: props.role });
    }

    return {
        cookie: [res.headers['set-cookie'].pop().split(';')[0]],
        userId: res.body.id,
        balconyId: res.body.balcony.id,
    };
};
