module.exports = {
    config: { update: jest.fn() },
    S3: jest.fn(() => ({
        upload: jest.fn(() => ({
            promise: jest.fn(() => ({ Location: 'uploaded-url' })),
        })),
    })),
};
