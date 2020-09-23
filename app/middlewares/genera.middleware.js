import { Op } from 'sequelize';
import db from '../models/models';

const { Genus } = db;

// eslint-disable-next-line import/prefer-default-export
export const checkDuplicates = async (req, res, next) => {
    const genus = await Genus.findOne({ where: { name: req.body.name, id: { [Op.not]: req.id } } });
    if (genus) {
        return res.status(400).send({ message: 'Genus already exists' });
    }

    return next();
};
