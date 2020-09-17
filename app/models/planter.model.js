import { SHAPES, COLORS, EXPOSURES } from '../constants';

export default (sequelize, Sequelize) => {
    const Planter = sequelize.define('planters', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        shape: {
            type: Sequelize.ENUM({ values: SHAPES }),
            allowNull: false,
        },
        dimensions: {
            type: Sequelize.JSON,
            allowNull: false,
        },
        color: {
            type: Sequelize.ENUM({ values: COLORS }),
            allowNull: false,
        },
        exposure: {
            type: Sequelize.ENUM({ values: EXPOSURES }),
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
    }, {
        defaultScope: {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
    });

    Planter.associate = (models) => {
        Planter.hasMany(models.Planting, {
            foreignKey: 'planterId',
            as: 'plantings',
        });
    };

    return Planter;
};
