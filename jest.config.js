module.exports = {
    testEnvironment: 'node',
    moduleNameMapper: {
        '@/(.*)$': '<rootDir>/app/$1',
    },
    roots: ['<rootDir>', '<rootDir>/tests/'],
    setupFilesAfterEnv: ['jest-extended'],
    testTimeout: 10000,
};
