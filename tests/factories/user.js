import faker from 'faker';
import { ROLE_USER } from '@/constants';
import db from '@/models/models';

export default async (props = {}) => db.User.create({
    email: faker.internet.email(),
    username: faker.name.firstName(),
    role: ROLE_USER,
    ...props,
});
