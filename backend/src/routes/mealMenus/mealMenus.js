const express = require("express");
const router = express.Router();
const { getDB } = require("../../db");

// Get all meal menus
router.get("/all", (req, res) => {
  const db = getDB();
  db.all(
    "SELECT * FROM MEAL_MENUS ORDER BY MENU_DATE DESC",
    [],
    (err, rows) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      return res.json({ success: true, menus: rows });
    }
  );
});

// Get menu by date
router.get("/:date", (req, res) => {
  const db = getDB();
  db.get(
    "SELECT * FROM MEAL_MENUS WHERE MENU_DATE = ?",
    [req.params.date],
    (err, rows) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      if (!rows || Object.keys(rows).length === 0)
        return res.json({ success: true, menus: [] });
      return res.json({ success: true, menus: rows });
    }
  );
});

module.exports = router;
