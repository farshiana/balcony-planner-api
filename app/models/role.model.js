export default (sequelize, Sequelize) => {
    const Role = sequelize.define('roles', {
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

    Role.associate = (models) => {
        Role.belongsToMany(models.User, {
            through: 'users_roles',
            foreignKey: 'roleId',
            as: 'users',
        });
    };

    return Role;
};
