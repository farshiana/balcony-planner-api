export default (sequelize, Sequelize) => {
    const Balcony = sequelize.define('balconies', {
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

    Balcony.associate = (models) => {
        Balcony.hasMany(models.Planter, {
            foreignKey: 'balconyId',
            as: 'planters',
        });
    };

    return Balcony;
};