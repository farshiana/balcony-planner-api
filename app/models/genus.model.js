import { CATEGORIES } from '../constants';

export default (sequelize, Sequelize) => {
    const Genus = sequelize.define('genera', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        imageUrl: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        category: {
            type: Sequelize.ENUM({ values: CATEGORIES }),
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

    Genus.associate = (models) => {
        Genus.hasMany(models.Variety, {
            foreignKey: 'genusId',
            as: 'varieties',
        });
    };

    return Genus;
};
