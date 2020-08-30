import bcrypt from 'bcryptjs';
import db from '../models/models';
import config from '../config/auth.config';
import { ROLE_USER } from '../constants';

const authConfig = config[process.env.NODE_ENV];

const { User, Role } = db;

export const register = async (req, res, next) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });

        const role = await Role.findOne({ where: { name: ROLE_USER } });
        await user.setRoles(role);

        return next();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(404).send({ message: 'User was not found' });
        }

        const isValid = bcrypt.compareSync(req.body.password, user.password);
        if (!isValid) {
            return res.status(401).send({ accessToken: null, message: 'Password is invalid' });
        }

        const roles = await user.getRoles();
        req.session.user = user.dataValues;

        return res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: roles.map((role) => role.name),
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
