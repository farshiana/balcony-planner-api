import faker from 'faker';
import { CATEGORIES } from '@/constants';
import db from '@/models/models';

export default (props = {}) => db.Genus.create({
    name: faker.lorem.word(),
    category: CATEGORIES[0],
    ...props,
});
