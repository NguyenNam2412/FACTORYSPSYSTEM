const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const SECRET_KEY = process.env.SECRET_KEY; // change to secret key (save to env)
const { getDB } = require("@db");
const loggers = require("@utils/logger");

// emp login
router.post("/employee", (req, res) => {
  const { empId } = req.body;
  if (!empId)
    return res
      .status(400)
      .json({ success: false, error: "Missing employee ID" });
  const db = getDB();
  db.get(
    `SELECT E.EMP_ID, E.FULL_NAME, R.ROLE_NAME FROM EMPLOYEES E 
      JOIN EMPLOYEE_ROLES R ON E.EMP_ID = R.EMP_ID 
      WHERE E.EMP_ID = ? AND E.IS_ACTIVE = 1`,
    [empId],
    (err, row) => {
      if (err) {
        console.error(err);
        loggers.empLog.error("DB error:", err);
        return res.status(500).json({ error: "Internal error" });
      }

      if (!row) {
        loggers.empLog.warn(`EMP_ID: ${empId} doesn't exit`);
        return res
          .status(401)
          .json({ success: false, error: "Invalid emp id" });
      }

      try {
        const token = jwt.sign(
          { empId: row.EMP_ID, role: row.ROLE_NAME },
          SECRET_KEY
        );
        loggers.empLog.info(`emp ${empId} login success`);
        return res.json({
          success: true,
          token,
          empId: empId,
          empName: row.FULL_NAME,
          role: row.ROLE_NAME,
        });
      } catch (signError) {
        console.error("JWT Error:", signError);
        return res.status(500).json({ error: "JWT signing failed" });
      }
    }
  );
});

router.post("/admin", (req, res) => {
  const { username, password } = req.body;
  console.log("test", username, password, SECRET_KEY);
  const db = getDB();
  db.get(
    `SELECT ADMIN_ID FROM ADMINS WHERE USERNAME = ? AND PASSWORD = ? AND IS_ACTIVE = 1`,
    [username, password],
    (err, row) => {
      if (err) {
        console.error(err);
        loggers.adminLog.error("DB error:", err);
        return res.status(500).json({ error: "Internal error" });
      }

      if (!row) {
        loggers.adminLog.warn(`admin: ${username} doesn't exit`);
        return res
          .status(401)
          .json({ success: false, error: "Invalid admin credentials" });
      }

      try {
        const token = jwt.sign(
          { adminId: row.ADMIN_ID, username, role: "admin" },
          SECRET_KEY,
          { expiresIn: "4h" }
        );
        loggers.adminLog.info(`Admin ${username} login success`);
        return res.json({ success: true, token, username });
      } catch (signError) {
        console.error("JWT Error:", signError);
        return res.status(500).json({ error: "JWT signing failed" });
      }
    }
  );
});

module.exports = { authRouter: router, SECRET_KEY };
