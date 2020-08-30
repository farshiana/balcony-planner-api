export default {
    development: {
        secret: 'secret',
        cookie: {
            expires: 60000,
            secure: false,
        },
    },
    production: {
        secret: 'secret',
        cookie: {
            expires: 60000,
            secure: true,
        },
    },
};
