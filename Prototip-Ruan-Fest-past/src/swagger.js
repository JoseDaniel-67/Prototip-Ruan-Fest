const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ruan Fest API',
            version: '1.0.0',
            description: 'API para gerenciamento de aluguel de brinquedos',
        },
    },
    apis: ['./server.js'],
};

module.exports = swaggerJsdoc(options);