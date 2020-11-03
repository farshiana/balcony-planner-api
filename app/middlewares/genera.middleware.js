import { Op } from 'sequelize';
import db from '../models/models';

const { Genus } = db;

// eslint-disable-next-line import/prefer-default-export
export const checkDuplicates = async (req, res, next) => {
    const where = { name: req.body.name };
    if (req.params.genusId) {
        where.id = { [Op.not]: req.params.genusId };
    }
    const genus = await Genus.findOne({ where });
    if (genus) {
        return res.status(400).send({ message: 'Genus already exists' });
    }

    return next();
};
