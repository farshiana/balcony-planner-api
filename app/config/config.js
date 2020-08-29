require('dotenv').config();

module.exports = {
    development: {
        database: 'balcony_planner_dev',
        username: 'admin',
        password: 'password',
        host: '127.0.0.1',
        dialect: 'postgres',
    },
    test: {
        database: 'balcony_planner_test',
        username: 'postgres',
        password: null,
        host: '127.0.0.1',
        dialect: 'postgres',
    },
    production: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        dialect: 'postgres',
    },
};
