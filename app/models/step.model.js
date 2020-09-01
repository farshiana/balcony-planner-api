import { STEPS } from '../constants';

export default (sequelize, Sequelize) => sequelize.define('steps', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
    },
    type: {
        type: Sequelize.ENUM({ values: STEPS }),
        allowNull: false,
    },
    startDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    endDate: {
        type: Sequelize.DATE,
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
