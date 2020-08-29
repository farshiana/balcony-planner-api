import db from '../models/models';

const { User } = db;

export const checkDuplicates = async (req, res, next) => {
    let user = await User.findOne({ where: { username: req.body.username } });
    if (user) {
        return res.status(400).send({ message: 'Username already exists' });
    }

    user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
        return res.status(400).send({ message: 'Email already exists' });
    }

    return next();
};
