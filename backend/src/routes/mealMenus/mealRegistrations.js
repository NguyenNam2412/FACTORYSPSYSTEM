const express = require("express");
const router = express.Router();
const db = require("../../db").getDB();

// Get all registrations (optionally filter by EMP_ID or REG_DATE)
router.get("/", (req, res) => {
  const { emp_id, reg_date } = req.query;
  let sql = "SELECT * FROM MEAL_REGISTRATIONS WHERE 1=1";
  const params = [];
  if (emp_id) {
    sql += " AND EMP_ID = ?";
    params.push(emp_id);
  }
  if (reg_date) {
    sql += " AND REG_DATE = ?";
    params.push(reg_date);
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Assign meals for a period (date, week, month)
router.post("/assign", (req, res) => {
  const { EMP_ID, from_date, to_date, assign_type, MEAL_TYPE, NOTE } = req.body;
  if (!EMP_ID || !from_date) {
    return res.status(400).json({ error: "EMP_ID and from_date are required" });
  }

  let start = new Date(from_date);
  let end = new Date(from_date);

  if (assign_type === "month") {
    start.setDate(1);
    end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  } else if (assign_type === "week") {
    end.setDate(start.getDate() + 6);
  } else if (to_date) {
    end = new Date(to_date);
  }

  const days = getDateRange(
    start.toISOString().slice(0, 10),
    end.toISOString().slice(0, 10)
  );

  const insertPromises = days.map(
    (date) =>
      new Promise((resolve, reject) => {
        db.run(
          "INSERT OR IGNORE INTO MEAL_REGISTRATIONS (EMP_ID, REG_DATE, MEAL_TYPE, NOTE) VALUES (?, ?, ?, ?)",
          [EMP_ID, date, MEAL_TYPE || "lunch", NOTE || ""],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      })
  );

  Promise.all(insertPromises)
    .then(() => res.json({ success: true, assigned_dates: days }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Unsign meals for a period (date, week, month)
router.post("/unsign", (req, res) => {
  const { EMP_ID, from_date, to_date, assign_type } = req.body;
  if (!EMP_ID || !from_date) {
    return res.status(400).json({ error: "EMP_ID and from_date are required" });
  }

  let start = new Date(from_date);
  let end = new Date(from_date);

  if (assign_type === "month") {
    start.setDate(1);
    end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  } else if (assign_type === "week") {
    end.setDate(start.getDate() + 6);
  } else if (to_date) {
    end = new Date(to_date);
  }

  const days = getDateRange(
    start.toISOString().slice(0, 10),
    end.toISOString().slice(0, 10)
  );

  const deletePromises = days.map(
    (date) =>
      new Promise((resolve, reject) => {
        db.run(
          "DELETE FROM MEAL_REGISTRATIONS WHERE EMP_ID = ? AND REG_DATE = ?",
          [EMP_ID, date],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      })
  );

  Promise.all(deletePromises)
    .then(() => res.json({ success: true, unsigned_dates: days }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
