import { SHAPES, COLORS, EXPOSURES } from '../constants';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Planter:
 *        type: object
 *        required:
 *          - name
 *          - shape
 *          - position
 *          - dimensions
 *          - color
 *          - exposures
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the planter, needs to be unique.
 *          shape:
 *            type: string
 *            enum: [square, rectangle, circle]
 *          position:
 *            type: object
 *            properties:
 *              left:
 *                  type: string
 *              top:
 *                  type: string
 *          dimensions:
 *            type: object
 *            properties:
 *              width:
 *                  type: string
 *              height:
 *                  type: string
 *          color:
 *            type: string
 *            enum: [red, pink, purple, indigo]
 *          exposure:
 *            type: string
 *            enum: [shade, sun, partial]
 *          userId:
 *            type: string
 *            format: uuid
 *            description: Id of the user it belongs to.
 *          id:
 *            type: string
 *            format: uuid
 *        example:
 *           name: First planter
 *           shape: Square
 *           position: { left: 20px, top: 30px }
 *           dimensions: { width: 40px, height: 40px }
 *           color: pink
 *           exposure: shade
 */
export default (sequelize, Sequelize) => {
    const Planter = sequelize.define('planters', {
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
        shape: {
            type: Sequelize.ENUM({ values: SHAPES }),
            allowNull: false,
        },
        position: {
            type: Sequelize.JSON,
            allowNull: false,
        },
        dimensions: {
            type: Sequelize.JSON,
            allowNull: false,
        },
        color: {
            type: Sequelize.ENUM({ values: COLORS }),
            allowNull: false,
        },
        exposure: {
            type: Sequelize.ENUM({ values: EXPOSURES }),
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

    Planter.associate = (models) => {
        Planter.hasMany(models.Planting, {
            foreignKey: 'planterId',
            as: 'plantings',
        });
    };

    return Planter;
};
