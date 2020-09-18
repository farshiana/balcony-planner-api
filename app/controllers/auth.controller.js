import bcrypt from 'bcryptjs';
import db from '../models/models';
import { ROLE_ADMIN } from '../constants';

const { User, Balcony } = db;

export const register = async (req, res, next) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            role: ROLE_ADMIN, // TODO: replace with ROLE_USER
        });
        await user.createBalcony({ width: 500, height: 500 });

        return next();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.body.email },
            include: [{ model: Balcony, as: 'balcony' }],
        });

        if (!user) {
            return res.status(404).send({ message: 'User does not exist' });
        }

        const isValid = bcrypt.compareSync(req.body.password, user.password);
        if (!isValid) {
            return res.status(401).send({ accessToken: null, message: 'Password is invalid' });
        }

        req.session.userId = user.id;

        return res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            balcony: user.balcony,
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const getCurrentUser = (req, res) => res.status(200).send(res.locals.user);
