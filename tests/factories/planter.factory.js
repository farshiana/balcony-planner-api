import faker from 'faker';
import { SHAPES, COLORS, EXPOSURES } from '@/constants';
import db from '@/models/models';

export default (props = {}) => db.Planter.create({
    name: faker.lorem.word(),
    shape: SHAPES[0],
    dimensions: { radius: faker.random.number() },
    color: COLORS[0],
    exposure: EXPOSURES[0],
    ...props,
});
