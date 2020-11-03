/**
 * @swagger
 *  components:
 *    schemas:
 *      Plant:
 *        type: object
 *        required:
 *          - notes
 *          - userId
 *          - varietyId
 *        properties:
 *          notes:
 *            type: string
 *          userId:
 *            type: string
 *            format: uuid
 *            description: Id of the user it belongs to.
 *          varietyId:
 *            type: string
 *            format: uuid
 *            description: Id of the variety it belongs to.
 *          id:
 *            type: string
 *            format: uuid
 *        example:
 *           notes: Writing a comment
 */
export default (sequelize, Sequelize) => {
    const Plant = sequelize.define('plants', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
        },
        notes: {
            type: Sequelize.STRING,
            allowNull: true,
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

    Plant.associate = (models) => {
        Plant.belongsTo(models.User, {
            through: 'plants',
            foreignKey: 'userId',
            as: 'user',
        });
        Plant.belongsTo(models.Variety, {
            through: 'plants',
            foreignKey: 'varietyId',
            as: 'variety',
        });
        Plant.hasMany(models.Planting, {
            foreignKey: 'plantId',
            as: 'plantings',
        });
    };

    return Plant;
};
