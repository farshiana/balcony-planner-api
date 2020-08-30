export default {
    development: {
        secret: 'secret',
        cookie: {
            maxAge: 60000,
            secure: false,
        },
    },
    production: {
        secret: 'secret',
        cookie: {
            maxAge: 60000,
            secure: true,
        },
    },
};
