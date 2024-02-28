import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'
import express from 'express';
const docsRouter = express.Router(); // Corrected this line

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DO.IMPACT API',
      version: '1.0.0',
    },
  },
  apis: ['./docs/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default docsRouter;
