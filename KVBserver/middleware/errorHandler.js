import { sendEmail } from "../utils/emailService.js";

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error("Error:", err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = { message, statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = { message, statusCode: 401 };
  }

  // Send error notification email for critical errors (only in production)
  if (process.env.NODE_ENV === "production" && err.statusCode >= 500) {
    try {
      sendEmail(
        process.env.ADMIN_EMAIL || "admin@kvbenergies.com",
        "Critical Error Alert - KVB CRM",
        `A critical error occurred in the KVB CRM system:\n\nError: ${err.message}\n\nStack: ${err.stack}\n\nURL: ${req.originalUrl}\n\nMethod: ${req.method}\n\nIP: ${req.ip}\n\nUser Agent: ${req.get("User-Agent")}`,
        `<h2>Critical Error Alert</h2><p>A critical error occurred in the KVB CRM system:</p><ul><li><strong>Error:</strong> ${err.message}</li><li><strong>URL:</strong> ${req.originalUrl}</li><li><strong>Method:</strong> ${req.method}</li><li><strong>IP:</strong> ${req.ip}</li></ul><p>Please check the server logs for more details.</p>`
      ).catch((emailErr) =>
        console.error("Failed to send error notification:", emailErr)
      );
    } catch (emailErr) {
      console.error("Failed to send error notification:", emailErr);
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Async error handler wrapper
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 404 handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
