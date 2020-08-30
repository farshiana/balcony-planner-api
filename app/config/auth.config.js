export default {
    development: {
        secret: 'secret',
        expiresIn: '1d',
        secure: false,
    },
    production: {
        secret: 'secret',
        expiresIn: '7d',
        secure: true,
    },
};
