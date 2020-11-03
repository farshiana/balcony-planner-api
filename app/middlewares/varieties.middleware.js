import { Op } from 'sequelize';
import db from '../models/models';

const { Variety } = db;

// eslint-disable-next-line import/prefer-default-export
export const checkDuplicates = async (req, res, next) => {
    const where = { name: req.body.name };
    if (req.params.varietyId) {
        where.id = { [Op.not]: req.params.varietyId };
    }

    const variety = await Variety.findOne({ where });
    if (variety) {
        return res.status(400).send({ message: 'Variety already exists' });
    }

    return next();
};
