

const errorMiddleware = (err, req, res, next) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = "Une erreur est survenue";

  switch (err.name) {
    case "ValidationError":
      statusCode = 400;
      message = "Données invalides";
      break;

    case "JsonWebTokenError":
      statusCode = 401;
      message = "Token invalide";
      break;

    case "TokenExpiredError":
      statusCode = 401;
      message = "Token expiré";
      break;

    case "CastError":
      statusCode = 400;
      message = "Identifiant incorrect";
      break;

    case "MongoServerError":
      if (err.code === 11000) {
        statusCode = 409;
        message = "Doublon détecté";
      }
      break;

    default:
      message = err.message || message;
      break;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
