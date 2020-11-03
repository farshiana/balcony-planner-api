/**
 * @swagger
 *  components:
 *    schemas:
 *      Planting:
 *        type: object
 *        required:
 *          - position
 *          - seed
 *          - plant
 *          - harvest
 *          - planterId
 *          - plantId
 *        properties:
 *          position:
 *            type: object
 *            properties:
 *              left:
 *                  type: string
 *              top:
 *                  type: string
 *          seed:
 *              type: array
 *              items:
 *                  type: integer
 *          plant:
 *              type: array
 *              items:
 *                  type: integer
 *          harvest:
 *              type: array
 *              items:
 *                  type: integer
 *          planterId:
 *            type: string
 *            format: uuid
 *            description: Id of the planter it belongs to.
 *          plantId:
 *            type: string
 *            format: uuid
 *            description: Id of the plant it belongs to.
 *          id:
 *            type: string
 *            format: uuid
 *        example:
 *           position: { left: 20px, top: 30px }
 *           seed: [0, 3]
 *           plant: [4, 6]
 *           harvest: [5, 10]
 */
export default (sequelize, Sequelize) => sequelize.define('plantings', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
    },
    position: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    seed: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    plant: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    harvest: {
        type: Sequelize.JSON,
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
