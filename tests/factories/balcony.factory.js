import faker from 'faker';
import db from '@/models/models';

export default (props = {}) => db.Balcony.create({
    width: faker.random.number(),
    height: faker.random.number(),
    ...props,
});
