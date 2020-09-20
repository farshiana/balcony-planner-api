import db from '@/models/models';

export default (props = {}) => db.Planting.create({
    seed: [0, 1],
    plant: [2, 3],
    harvest: [4, 5],
    ...props,
});
