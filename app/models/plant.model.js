export default (sequelize, Sequelize) => {
    const Plant = sequelize.define('plants', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
        },
        notes: {
            type: Sequelize.STRING,
            allowNull: true,
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

    Plant.associate = (models) => {
        Plant.belongsTo(models.User, {
            through: 'plants',
            foreignKey: 'userId',
            as: 'user',
        });
        Plant.belongsTo(models.Variety, {
            through: 'plants',
            foreignKey: 'varietyId',
            as: 'variety',
        });
    };

    return Plant;
};
