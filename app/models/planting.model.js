export default (sequelize, Sequelize) => sequelize.define('plantings', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
    },
    position: {
        type: Sequelize.JSON,
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
