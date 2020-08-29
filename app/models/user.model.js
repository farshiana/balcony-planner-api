export default (sequelize, Sequelize) => sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
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
