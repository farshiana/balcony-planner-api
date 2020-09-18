export default (sequelize, Sequelize) => {
    const Planting = sequelize.define('plantings', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
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

    Planting.associate = (models) => {
        Planting.belongsTo(models.Planter, {
            foreignKey: 'planterId',
            as: 'planter',
        });
        Planting.belongsTo(models.Variety, {
            foreignKey: 'varietyId',
            as: 'variety',
        });
    };

    return Planting;
};