process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const { initDB } = require("@db");
const loggers = require("@utils/logger");

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000", // ['http://localhost:3000', 'https://domain.com']
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// generates DB
initDB();

const { verifyToken } = require("@middleware/authMiddleware");

const { authRouter } = require("@routes/auth");
const mealMenusRouter = require("@routes/mealMenus/mealMenus");
const fileMealMenusRouter = require("@routes/mealMenus/mealMenusUpload");
const mealRegistrationsRouter = require("@routes/mealMenus/mealRegistrations");

const publicPaths = ["/login"];

app.use((req, res, next) => {
  // pass verifyToken with router start with /login/
  if (publicPaths.some((path) => req.path.startsWith(path))) {
    return next();
  }
  verifyToken(req, res, next);
});

app.use("/login", authRouter);
app.use("/meal-menus", mealMenusRouter);
app.use("/meal-menus", fileMealMenusRouter);
app.use("/meal-registrations", mealRegistrationsRouter);

app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    console.warn("Request timed out");
    res.status(503).json({ error: "Request timeout" });
  });
  next();
});

app.use((req, res, next) => {
  loggers.empLog.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use((err, req, res, next) => {
  loggers.errorLog.error("Uncaught error:", err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

module.exports = app;
