module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('varieties', {
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
                type: Sequelize.ENUM({ values: ['shade', 'sun', 'partial'] }),
                allowNull: false,
            },
            watering: {
                type: Sequelize.ENUM({ values: ['low', 'medium', 'high'] }),
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
    },
    down(queryInterface) {
        return queryInterface.dropTable('varieties');
    },
};
