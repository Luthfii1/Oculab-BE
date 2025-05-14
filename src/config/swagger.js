const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Oculab API",
    version: "1.0.0",
    description: "This is Oculab API Documentation",
  },
  servers: [
    {
      url: "/",
      description: "Current Server",
    },
  ],
};

const resolvedApiPaths = [
  path.resolve(__dirname, "../routes/*.js"),
  path.resolve(__dirname, "../docs/*.swagger.js"),
];

const options = {
  swaggerDefinition,
  apis: resolvedApiPaths,
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
