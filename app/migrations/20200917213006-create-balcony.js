module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('balconies', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
            },
            width: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            height: {
                type: Sequelize.INTEGER,
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
        return queryInterface.dropTable('balconies');
    },
};
