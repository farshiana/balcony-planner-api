module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('genera', {
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
            category: {
                type: Sequelize.ENUM({ values: ['fruits', 'herbs', 'vegetables'] }),
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
        return queryInterface.dropTable('genera');
    },
};
