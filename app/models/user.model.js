export default (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
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

    User.associate = (models) => {
        User.belongsToMany(models.Role, {
            through: 'users_roles',
            foreignKey: 'userId',
            as: 'roles',
        });
        User.hasMany(models.Balcony, {
            foreignKey: 'userId',
        });
        User.belongsToMany(models.Variety, {
            through: 'plants',
            foreignKey: 'userId',
            as: 'varieties',
        });
    };

    return User;
};
