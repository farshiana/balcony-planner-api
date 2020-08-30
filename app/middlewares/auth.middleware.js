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

export const checkAuth = (req, res, next) => (req.user ? next() : res.status(401).send({ message: 'Authentication is required' }));

export const checkAdmin = (req, res, next) => (req.session.roles.includes(ROLE_ADMIN) ? next()
    : res.status(403).send({ message: 'Admin role is required' }));
