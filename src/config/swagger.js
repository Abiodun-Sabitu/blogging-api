const swaggerJSDoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Blogging API',
    version: '1.0.0',
    description: 'A RESTful API for a blogging platform with user authentication, blog management, and more.'
  },
  servers: [
  {
    url: process.env.BASEURL || 'http://localhost:8000/api/v1',
    description: process.env.NODE_ENV === 'production'
      ? 'Production Blogging API server'
      : 'Local development server'
  }
],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/model/*.js', './src/docs/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
