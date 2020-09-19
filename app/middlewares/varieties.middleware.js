import db from '../models/models';

const { Variety } = db;

export const checkDuplicates = async (req, res, next) => {
    const variety = await Variety.findOne({ where: { name: req.body.name } });
    if (variety) {
        return res.status(400).send({ message: 'Variety already exists' });
    }

    return next();
};
