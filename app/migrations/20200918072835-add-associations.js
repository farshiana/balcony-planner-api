module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn('balconies', 'userId', {
            type: Sequelize.UUID,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        }),
        queryInterface.addColumn('varieties', 'genusId', {
            type: Sequelize.UUID,
            references: {
                model: 'genera',
                key: 'id',
            },
            onDelete: 'CASCADE',
        }),
        queryInterface.addColumn('plants', 'userId', {
            type: Sequelize.UUID,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        }),
        queryInterface.addColumn('plants', 'varietyId', {
            type: Sequelize.UUID,
            references: {
                model: 'varieties',
                key: 'id',
            },
            onDelete: 'CASCADE',
        }),
        queryInterface.addColumn('planters', 'userId', {
            type: Sequelize.UUID,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        }),
        queryInterface.addColumn('plantings', 'planterId', {
            type: Sequelize.UUID,
            references: {
                model: 'planters',
                key: 'id',
            },
            onDelete: 'CASCADE',
        }),
        queryInterface.addColumn('plantings', 'varietyId', {
            type: Sequelize.UUID,
            references: {
                model: 'varieties',
                key: 'id',
            },
            onDelete: 'CASCADE',
        }),
    ]),
    down: async (queryInterface) => Promise.all([
        queryInterface.removeColumn('balconies', 'userId'),
        queryInterface.removeColumn('varieties', 'genusId'),
        queryInterface.removeColumn('plants', 'userId'),
        queryInterface.removeColumn('plants', 'varietyId'),
        queryInterface.removeColumn('planters', 'userId'),
        queryInterface.removeColumn('plantings', 'planterId'),
        queryInterface.removeColumn('plantings', 'varietyId'),
    ]),
};
