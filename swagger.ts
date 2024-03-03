import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const docsRouter = express.Router();

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0', // Ensure this matches with your OpenAPI version
    info: {
      title: 'DO.IMPACT API',
      version: '1.0.0',
      description: 'API for managing users',
    },
    securityDefinitions: {
      bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          scheme: 'bearer',
          bearerFormat: 'JWT',
      },
  },
  },
  apis: ['./docs/*.yaml'], // Ensure this path correctly points to your YAML files
};

const swaggerSpec = swaggerJSDoc(options);

docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default docsRouter;
