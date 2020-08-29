export default (sequelize, Sequelize) => sequelize.define('Role', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
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
