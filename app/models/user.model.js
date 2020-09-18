import { ROLES } from '../constants';

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
        email: {
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
        User.hasOne(models.Balcony, { foreignKey: 'balconyId', as: 'balcony' });
        User.hasMany(models.Planter, { foreignKey: 'userId', as: 'planters' });
        User.hasMany(models.Planting, { foreignKey: 'userId', as: 'plantings' });
    };

    return User;
};
