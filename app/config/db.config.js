require('dotenv').config();

module.exports = {
    test: {
        database: 'balcony_planner_test',
        username: 'admin',
        password: 'password',
        host: '127.0.0.1',
        dialect: 'postgres',
        logging: false,
    },
    development: {
        database: 'balcony_planner_dev',
        username: 'admin',
        password: 'password',
        host: '127.0.0.1',
        dialect: 'postgres',
        logging: true,
    },
    production: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
};
