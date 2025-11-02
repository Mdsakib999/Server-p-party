import { envVariables } from "../config/envVariables.js";

const globalErrorHandler = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err?.name === "ValidationError") {
    err.message = Object.values(err?.errors)
      ?.map((val) => val.message)
      ?.join(", ");
    err.statusCode = 400;
  }

  if (err?.code === 11000) {
    err.message = "Duplicate field value entered (unique constraint failed)";
    err.statusCode = 400;
  }

  if (err?.name === "CastError") {
    err.message = `Invalid ${err?.path}: ${err?.value}`;
    err.statusCode = 400;
  }

  if (err?.name === "JsonWebTokenError") {
    err.message = "Invalid token. Please log in again.";
    err.statusCode = 401;
  }

  if (err?.name === "TokenExpiredError") {
    err.message = "Your token has expired! Please log in again.";
    err.statusCode = 401;
  }

  res.status(err?.statusCode).json({
    success: false,
    status: err?.status,
    message: err?.message,
    err: envVariables.NODE_ENV === "development" ? err : null,
    stack: envVariables.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
