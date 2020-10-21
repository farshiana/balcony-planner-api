import faker from 'faker';
import db from '@/models/models';

export default (props = {}) => db.Planting.create({
    position: { left: faker.random.number(), top: faker.random.number() },
    seed: [0, 1],
    plant: [2, 3],
    harvest: [4, 5],
    ...props,
});
