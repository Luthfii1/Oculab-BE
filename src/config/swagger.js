const { version } = require("mongoose");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Oculab API",
    version: "1.0.0",
    description: "This is Oculab API Documentation",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js", "./src/docs/*.swagger.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
