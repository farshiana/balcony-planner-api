import faker from 'faker';
import db from '@/models/models';

export default (props = {}) => db.Plant.create({
    notes: faker.random.word(),
    ...props,
});
