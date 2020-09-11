export default {
    development: {
        secret: 'secret',
        cookie: {
            maxAge: 60000,
            secure: false,
            httpOnly: true,
        },
    },
    production: {
        secret: 'secret',
        cookie: {
            maxAge: 60000,
            secure: true,
            httpOnly: true,
        },
    },
};
