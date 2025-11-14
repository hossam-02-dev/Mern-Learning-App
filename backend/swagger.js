// 📘 swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning Platform API",
      version: "1.0.0",
      description:
        "Documentation complète de l'API backend pour la plateforme Learning. Gère les utilisateurs, cours, quiz, progression, paiements et fichiers.",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./swaggerDoc.js"], // lit tes fichiers de routes
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📚 Swagger UI disponible sur http://localhost:4000/api-docs");
};
