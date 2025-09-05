const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const loggers = require("@utils/logger");

let db;

function initDB() {
  if (!db) {
    db = new sqlite3.Database(
      path.join(__dirname, "../db/SPSYSTEM.db"),
      (err) => {
        if (err) {
          console.error("connect error SQLite:", err.message);
          loggers.errorLog.error("connect error SQLite:", err.message);
        } else {
          loggers.dbLog.info("connect success SQLite");
          console.log("connect success SQLite");
          db.configure("busyTimeout", 5000);
        }
      }
    );
  }
  return db;
}

function getDB() {
  return db;
}

module.exports = { initDB, getDB };
