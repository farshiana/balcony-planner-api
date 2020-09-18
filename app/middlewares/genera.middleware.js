import db from '../models/models';

const { Genus } = db;

export const checkDuplicates = async (req, res, next) => {
    const genus = await Genus.findOne({ where: { name: req.body.name } });
    if (genus) {
        return res.status(400).send({ message: 'Genus already exists' });
    }

    return next();
};
