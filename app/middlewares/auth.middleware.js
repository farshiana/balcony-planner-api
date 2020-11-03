import db from '../models/models';
import { ROLE_ADMIN } from '../constants';

const { User, Balcony } = db;

export const checkDuplicates = async (req, res, next) => {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (user) {
        return res.status(400).send({ message: 'Username already exists' });
    }

    return next();
};

export const checkAuth = async (req, res, next) => {
    if (['/auth/register', '/auth/login'].includes(req.path)) return next();

    if (req.session.userId) {
        const user = await User.findByPk(req.session.userId, { include: [{ model: Balcony, as: 'balcony' }] });

        if (user) {
            res.locals.user = user;
            return next();
        }
    }

    return res.status(401).send({ message: 'Authentication is required' });
};

export const checkAdmin = async (req, res, next) => (
    res.locals.user.role === ROLE_ADMIN ? next()
        : res.status(403).send({ message: 'Admin role is required' })
);
