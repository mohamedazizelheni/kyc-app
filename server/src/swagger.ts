import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
dotenv.config();

const serverUrl = process.env.SWAGGER_SERVER_URL
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fullstack KYC App API',
      version: '1.0.0',
      description: 'API documentation for the Fullstack KYC application',
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
