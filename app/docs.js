import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'Balcony Planner API',
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    basePath: '/',
};

export default swaggerJsdoc({
    swaggerDefinition,
    apis: ['./app/**/*.js'],
});
