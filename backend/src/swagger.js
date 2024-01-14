import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Documentation',
            version: '1.0.0',
            description: 'API documentation for your project',
        },
    },
    apis: ['./backend/routers/food.router.js', './backend/routers/user.router.js', './backend/routers/order.router.js'],

};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
    console.log('Swagger: Registering API documentation middleware');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
