const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const SECRET_KEY = process.env.SECRET_KEY; // change to secret key (save to env)
const { getDB } = require("../../db");
const loggers = require("../../utils/logger");

// emp login
router.get("/employee", (req, res) => {
  const { emp_id } = req.body;
  if (!emp_id) return res.status(400).json({ error: "can't find emp id" });
  const db = getDB();
  db.get(
    `SELECT E.EMP_ID, R.ROLE_NAME FROM EMPLOYEES E 
      JOIN EMPLOYEE_ROLES R ON E.EMP_ID = R.EMP_ID 
      WHERE E.EMP_ID = ? AND E.IS_ACTIVE = 1`,
    [emp_id],
    (err, row) => {
      if (err) {
        console.error(err);
        loggers.empLog.error("DB error:", err);
        return res.status(500).json({ error: "Internal error" });
      }

      if (!row) {
        loggers.empLog.warn(`EMP_ID: ${emp_id} doesn't exit`);
        return res
          .status(401)
          .json({ success: false, error: "Invalid emp id" });
      }

      try {
        const token = jwt.sign({ emp_id, role: row.ROLE_NAME }, SECRET_KEY);
        loggers.empLog.info(`emp ${emp_id} login success`);
        return res.json({ success: true, token });
      } catch (signError) {
        console.error("JWT Error:", signError);
        return res.status(500).json({ error: "JWT signing failed" });
      }
    }
  );
});

router.get("/admin", (req, res) => {
  const { username, password } = req.body;
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
          { admin_id: row.ADMIN_ID, username, role: "admin" },
          SECRET_KEY,
          { expiresIn: "4h" }
        );
        loggers.adminLog.info(`Admin ${username} login success`);
        return res.json({ success: true, token });
      } catch (signError) {
        console.error("JWT Error:", signError);
        return res.status(500).json({ error: "JWT signing failed" });
      }
    }
  );
});

module.exports = { authRouter: router, SECRET_KEY };
