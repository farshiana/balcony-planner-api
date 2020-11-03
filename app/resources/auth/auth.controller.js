import bcrypt from 'bcryptjs';
import db from '../../models/models';
import { ROLE_USER } from '../../constants';

const { User, Balcony } = db;

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     description: Creates and logs in user
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The authenticated user
 *         schema:
 *           $ref: '#/components/schemas/User'
 *       400:
 *          description: Invalid param
 *       500:
 *         description: Internal error
 */
export const register = async (req, res, next) => {
    try {
        const user = await User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            role: ROLE_USER,
        });
        await user.createBalcony({ width: 500, height: 500 });

        return next();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /auth/login:
 *   put:
 *     tags:
 *       - Auth
 *     description: Logs user in
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The authenticated user
 *         schema:
 *           $ref: '#/components/schemas/User'
 *       400:
 *          description: Invalid param
 *       401:
 *          description: Invalid password
 *       404:
 *          description: User does not exist
 *       500:
 *         description: Internal error
 */
export const login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { username: req.body.username },
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
            role: user.role,
            balcony: user.balcony,
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     description: Logs current authenticated user out
 *     responses:
 *       200:
 *         description: User was logged out
 *       401:
 *          description: User not authenticated
 *       500:
 *         description: Internal error
 */
export const logout = async (req, res) => {
    try {
        await req.session.destroy();

        return res.status(200).send({ message: 'Logout successful' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /auth/current:
 *   get:
 *     tags:
 *       - Auth
 *     description: Returns current authenticated user
 *     responses:
 *       200:
 *         description: Current authenticated user
 *         schema:
 *           $ref: '#/components/schemas/User'
 *       401:
 *          description: User not authenticated
 *       500:
 *         description: Internal error
 */
export const getCurrentUser = (req, res) => res.status(200).send({
    id: res.locals.user.id,
    role: res.locals.user.role,
    username: res.locals.user.username,
    balcony: res.locals.user.balcony,
});
