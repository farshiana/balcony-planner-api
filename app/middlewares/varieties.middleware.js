import { Op } from 'sequelize';
import db from '../models/models';

const { Variety } = db;

// eslint-disable-next-line import/prefer-default-export
export const checkDuplicates = async (req, res, next) => {
    const variety = await Variety.findOne({ where: { name: req.body.name, id: { [Op.not]: req.id } } });
    if (variety) {
        return res.status(400).send({ message: 'Variety already exists' });
    }

    return next();
};