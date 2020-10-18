import { EXPOSURES, WATERINGS } from '../constants';

export default (sequelize, Sequelize) => {
    const Variety = sequelize.define('varieties', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        imageUrl: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        exposure: {
            type: Sequelize.ENUM({ values: EXPOSURES }),
            allowNull: false,
        },
        watering: {
            type: Sequelize.ENUM({ values: WATERINGS }),
            allowNull: false,
        },
        seed: {
            type: Sequelize.JSON,
            allowNull: false,
        },
        plant: {
            type: Sequelize.JSON,
            allowNull: false,
        },
        harvest: {
            type: Sequelize.JSON,
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

    Variety.associate = (models) => {
        Variety.belongsTo(models.Genus, {
            foreignKey: 'genusId',
            as: 'genus',
        });
    };

    return Variety;
};
