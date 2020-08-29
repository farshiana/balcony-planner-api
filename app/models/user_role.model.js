export default (sequelize, Sequelize) => {
    const UserRole = sequelize.define('users_roles', {
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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    });

    UserRole.associate = (models) => {
        UserRole.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        UserRole.belongsTo(models.Role, {
            foreignKey: 'roleId',
            as: 'role',
        });
    };

    return UserRole;
};
