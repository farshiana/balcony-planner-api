import request from 'supertest';
import faker from 'faker';
import app from '@/server';

export const getCookie = async () => {
    const res = await request(app).post('/auth/register').send({
        email: faker.internet.email(),
        username: faker.name.firstName(),
        password: faker.internet.password(),
    });
    expect(res.statusCode).toEqual(200);
    return res.headers['set-cookie'].pop().split(';')[0];
};
