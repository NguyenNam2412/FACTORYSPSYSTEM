const express = require("express");
const router = express.Router();
const { getDB } = require("@db");

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

router.get("/listFilesMealMenus", (req, res) => {
  const db = getDB();
  db.all(
    "SELECT FILE_ID AS fileId, FILE_NAME AS fileName, UPLOADED_AT AS uploadedAt FROM MEAL_MENU_FILES ORDER BY UPLOADED_AT DESC",
    [],
    (err, rows) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      return res.json({ success: true, listFile: rows });
    }
  );
});

module.exports = router;
