module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('planters', {
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
                type: Sequelize.ENUM({ values: ['circle', 'square', 'rectangle'] }),
                allowNull: false,
            },
            position: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            dimensions: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            color: {
                type: Sequelize.ENUM({
                    values: ['red', 'pink', 'purple', 'indigo', 'blue', 'cyan', 'teal',
                        'green', 'yellow', 'orange', 'brown', 'grey'],
                }),
                allowNull: false,
            },
            exposure: {
                type: Sequelize.ENUM({ values: ['shade', 'sun', 'partial'] }),
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
        return queryInterface.dropTable('planters');
    },
};
