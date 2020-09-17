import faker from 'faker';
import { ROLE_USER } from '@/constants';
import db from '@/models/models';

export default (props = {}) => db.User.create({
    email: faker.internet.email(),
    username: faker.name.firstName(),
    password: faker.internet.password(),
    role: ROLE_USER,
    ...props,
});
