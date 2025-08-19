const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
});

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const empTransport = new transports.File({
  filename: path.join(logDir, "emp.log"),
  level: "info",
});

const adminTransport = new transports.File({
  filename: path.join(logDir, "admin.log"),
  level: "info",
});

const dbTransport = new transports.File({
  filename: path.join(logDir, "db.log"),
  level: "info",
});

const errorTransport = new transports.File({
  filename: path.join(logDir, "error.log"),
  level: "error",
});

const consoleTransport = new transports.Console({
  level: "debug",
  format: combine(colorize(), logFormat),
});

const logger = createLogger({
  // level: "info", // info, warn, err
  format: combine(
    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // new transports.File({ filename: path.join(__dirname, "../logs/query.log") }),
    consoleTransport,
    errorTransport,
  ],
  exitOnError: false,
});

const loggers = {
  empLog: logger.child({ transports: [empTransport] }),
  adminLog: logger.child({ transports: [adminTransport] }),
  dbLog: logger.child({ transports: [dbTransport] }),
  errorLog: logger, // lỗi chung
};

module.exports = loggers;
