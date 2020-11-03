require('dotenv').config();

module.exports = {
    test: {
        secretAccessKey: 'secretAccessKey',
        accessKeyId: 'accessKeyId',
        region: 'eu-west-3',
        bucket: 'balcony-planner-dev',
    },
    development: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        region: 'eu-west-3',
        bucket: 'balcony-planner-dev',
    },
    production: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        region: 'eu-west-3',
        bucket: 'balcony-planner',
    },
};
