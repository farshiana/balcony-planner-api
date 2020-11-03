import faker from 'faker';
import db from '@/models/models';
import { ROLE_USER } from '@/constants';

export default (props = {}) => db.User.create({
    username: faker.unique(faker.name.firstName),
    password: faker.internet.password(),
    role: ROLE_USER,
    ...props,
});
