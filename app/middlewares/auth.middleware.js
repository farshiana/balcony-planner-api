import db from '../models/models';
import { ROLE_ADMIN } from '../constants';

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

export const checkAuth = async (req, res, next) => {
    if (req.session.userId) {
        const user = await User.findByPk(req.session.userId);

        if (user) {
            res.locals.user = user;
            return next();
        }
    }

    return res.status(401).send({ message: 'Authentication is required' });
};

export const checkAdmin = async (req, res, next) => {
    const roles = await res.locals.user.getRoles();

    return roles.find(role => role.name === ROLE_ADMIN) ? next() : res.status(403).send({ message: 'Admin role is required' });
};
