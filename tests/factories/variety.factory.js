import faker from 'faker';
import { EXPOSURES, WATERINGS } from '@/constants';
import db from '@/models/models';

export default (props = {}) => db.Variety.create({
    name: faker.lorem.word(),
    imageUrl: faker.internet.url(),
    exposure: EXPOSURES[0],
    watering: WATERINGS[0],
    seed: [0, 1],
    plant: [2, 3],
    harvest: [4, 5],
    ...props,
});
