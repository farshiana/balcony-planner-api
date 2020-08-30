import jwt from 'jsonwebtoken';
import config from '../config/auth.config';
import db from '../models/models';
import { ROLE_ADMIN } from '../constants';

const { User } = db;

export const checkToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({ message: 'Token is required' });
    }

    return jwt.verify(token, config.secret, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: 'Token is invalid' });
        }

        req.userId = decoded.id;
        return next();
    });
};

export const checkAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.userId);

    const roles = await user.getRoles();

    return roles.includes(ROLE_ADMIN) ? next()
        : res.status(403).send({ message: 'Admin role is required' });
};
