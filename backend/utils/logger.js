import pino from "pino";
import { LOG_LEVEL, NODE_ENV } from "../config/config.js";

const logLevel = LOG_LEVEL;

const transport = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: true,
    levelFirst: true,
    translateTime: "SYS:standard",
    ignore: "pid,hostname",
  },
});

export const logger = pino(
  {
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    base: {
      env: NODE_ENV,
    },
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        'res.headers["set-cookie"]',
        "*.password",
        "*.token",
        "*.secret",
      ],
      remove: true,
    },
  },
  transport
);

// Create child loggers for different contexts
export const createChildLogger = (context) => {
  return logger.child({ context });
};

// Utility functions for common logging patterns
export const logError = (error, context = {}) => {
  logger.error(
    {
      err: {
        message: error.message,
        stack: error.stack,
        code: error.code,
        ...context,
      },
    },
    error.message
  );
};

export const logRequest = (req, res, responseTime) => {
  logger.info(
    {
      req: {
        id: req.id,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        headers: req.headers,
      },
      res: {
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
      },
    },
    `${req.method} ${req.url} ${res.statusCode}`
  );
};
