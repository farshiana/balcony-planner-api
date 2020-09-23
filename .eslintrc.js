module.exports = {
    root: true,
    env: {
        node: true,
        'jest/globals': true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'max-len': ['error', { code: 120 }],
        'linebreak-style': ['error', 'windows'],
        indent: ['error', 4],
        'import/no-unresolved': 'off', // TODO: fix jest aliases
    },
    plugins: ['jest'],
};
