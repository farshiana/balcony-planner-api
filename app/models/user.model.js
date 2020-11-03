import { ROLES } from '../constants';

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - username
 *          - password
 *        properties:
 *          username:
 *            type: string
 *            description: Username of the user, needs to be unique.
 *          password:
 *            type: string
 *          id:
 *            type: string
 *            format: uuid
 *        example:
 *           username: Toto
 *           password: secure_password
 */
export default (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        role: {
            type: Sequelize.ENUM({ values: ROLES }),
            allowNull: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    });

    User.associate = (models) => {
        User.hasOne(models.Balcony, { foreignKey: 'userId', as: 'balcony' });
        User.hasMany(models.Planter, { foreignKey: 'userId', as: 'planters' });
        User.hasMany(models.Plant, { foreignKey: 'userId', as: 'plants' });
    };

    return User;
};
