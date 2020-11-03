import { CATEGORIES } from '../constants';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Genus:
 *        type: object
 *        required:
 *          - name
 *          - category
 *          - genusId
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the genus, needs to be unique.
 *          category:
 *            type: string
 *            enum: [fruits, vegetables, herbs]
 *          genusId:
 *            type: string
 *            format: uuid
 *            description: Id of the genus it belongs to.
 *          id:
 *            type: string
 *            format: uuid
 *        example:
 *           name: Strawberry
 *           category: Fruits
 */
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
