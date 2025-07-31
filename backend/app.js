process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const { initDB } = require("./src/db");
const logger = require("./src/utils/logger");

const app = express();
app.use(bodyParser.json());

// generates DB
initDB();

const { authRouter } = require("./src/routes/auth/auth");
const mealMenusRouter = require("./src/routes/mealMenus/mealMenus");
const mealRegistrationsRouter = require("./src/routes/mealMenus/mealRegistrations");

app.use("/login", authRouter);
app.use("/meal-menus", mealMenusRouter);
app.use("/meal-registrations", mealRegistrationsRouter);

app.use((res, next) => {
  res.setTimeout(15000, () => {
    console.warn("Request timed out");
    res.status(503).json({ error: "Request timeout" });
  });
  next();
});

app.use((req, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use((err, res) => {
  logger.error("Uncaught error:", err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

module.exports = app;
