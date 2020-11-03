/**
 * @swagger
 *  components:
 *    schemas:
 *      Balcony:
 *        type: object
 *        required:
 *          - width
 *          - height
 *        properties:
 *          width:
 *            type: integer
 *            description: Width of the balcony, needs to be positive.
 *          height:
 *            type: integer
 *            description: Height of the balcony, needs to be positive.
 *          userId:
 *            type: string
 *            format: uuid
 *            description: Id of the user it belongs to.
 *          id:
 *            type: string
 *            format: uuid
 *        example:
 *           width: 500
 *           height: 500
 */
export default (sequelize, Sequelize) => sequelize.define('balconies', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
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
