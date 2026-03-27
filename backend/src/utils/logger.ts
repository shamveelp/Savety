import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format for development
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // capture stack trace
    logFormat
  ),
  defaultMeta: { service: "savety-api" },
  transports: [
    // Console transport for real-time logging
    new winston.transports.Console({
      format: combine(
        colorize(),
        logFormat
      )
    }),
    // File transport for error logs in production
    new winston.transports.File({ 
      filename: "logs/error.log", 
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // File transport for all logs
    new winston.transports.File({ 
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Avoid logging to files in development if preferred, 
// but here they are kept for persistence.

export default logger;
