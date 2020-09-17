export default {
    test: {
        secret: 'secret',
        cookie: {
            maxAge: 60000 * 60 * 24 * 7,
            secure: false,
            httpOnly: true,
        },
    },
    development: {
        secret: 'secret',
        cookie: {
            maxAge: 60000 * 60 * 24 * 7,
            secure: false,
            httpOnly: true,
        },
    },
    production: {
        secret: 'secret',
        cookie: {
            maxAge: 60000 * 60 * 24 * 7,
            secure: true,
            httpOnly: true,
        },
    },
};
