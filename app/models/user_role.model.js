export default (sequelize, Sequelize) => sequelize.define('users_roles', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
});
