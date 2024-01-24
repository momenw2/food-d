// // import swaggerJsdoc from 'swagger-jsdoc';
// // import swaggerUi from 'swagger-ui-express';

// // export default (app) => {
// //     const options = {
// //         definition: {
// //         openapi: '3.0.0',
// //         info: {
// //             title: 'Food API Documentation',
// //             version: '1.0.0',
// //             description: 'Documentation for your Express API',
// //         },
// //         },
// //         apis: ['./routers/food.router.js'], // Make sure this path is correct
// //     };

// //     const specs = swaggerJsdoc(options);

// //     console.log('Swagger: Registering API documentation middleware');
// //     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// //     };

// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

// console.log('Swagger: Starting Swagger setup');


//     export default (app) => {
//     const options = {
//         definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Food API Documentation',
//             version: '1.0.0',
//             description: 'Documentation for your Express API',
//         },
//         },
//         apis: ['./routes/food.router.js'], // Make sure this path is correct
//     };

//     // Log options for debugging
//     console.log('Swagger: Options for SwaggerJsdoc:', options);

//     try {
//         const specs = swaggerJsdoc(options);

//         // Log specs for debugging
//         console.log('Swagger: Specs generated successfully:', specs);

//         console.log('Swagger: Registering API documentation middleware');
//         app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
//     } catch (error) {
//         // Log any errors that occur during Swagger setup
//         console.error('Swagger: Error setting up Swagger documentation', error);
//     }
//     };
