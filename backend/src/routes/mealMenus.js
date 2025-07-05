const express = require("express");
const router = express.Router();
const db = require("../db").getDB();

const multer = require("multer");
const XLSX = require("xlsx");
const upload = multer({ storage: multer.memoryStorage() });


// Get all meal menus
router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM MEAL_MENUS ORDER BY MENU_DATE DESC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Get menu by date
router.get("/:date", (req, res) => {
  db.get(
    "SELECT * FROM MEAL_MENUS WHERE MENU_DATE = ?",
    [req.params.date],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Menu not found" });
      res.json(row);
    }
  );
});

router.post("/upload", upload.single("file"), async (req, res) => {
  const { menu_date, upload_type } = req.body;
  if (!menu_date)
    return res.status(400).json({ error: "MENU_DATE is required" });

  // Check if date is in the past
  const today = new Date();
  const inputDate = new Date(menu_date);
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  if (inputDate < today) {
    return res.status(400).json({ error: "MENU_DATE cannot be in the past" });
  }

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Determine period
  let fromDate = new Date(menu_date);
  let toDate = new Date(menu_date);
  if (upload_type === "month") {
    // Set to first day of month
    fromDate.setDate(1);
    // Set to last day of month
    toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
  } else {
    // Default is week: from menu_date to 6 days after
    toDate.setDate(fromDate.getDate() + 6);
  }

  // Format dates as YYYY-MM-DD
  const formatDate = (d) => d.toISOString().slice(0, 10);
  const from_date_str = formatDate(fromDate);
  const to_date_str = formatDate(toDate);

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // Remove existing menus for this period
    await new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM MEAL_MENUS WHERE MENU_DATE >= ? AND MENU_DATE <= ?",
        [from_date_str, to_date_str],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Insert new menus
    const insertPromises = rows.map((row) => {
      // row.MENU_DATE should be present in Excel for each row
      return new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO MEAL_MENUS (MENU_DATE, MENU_TYPE, MENU_DESC) VALUES (?, ?, ?)",
          [row.MENU_DATE, row.MENU_TYPE, row.MENU_DESC],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });

    await Promise.all(insertPromises);

    res.json({
      success: true,
      period: { from: from_date_str, to: to_date_str },
      menus: rows,
    });
  } catch (err) {
    res.status(500).json({ error: "Invalid Excel file or data" });
  }
});

// Delete menus by period (from_date to to_date)
router.delete("/period", (req, res) => {
  let { from_date, to_date, delete_type } = req.body;

  // If delete_type is provided, calculate from_date and to_date accordingly
  if (delete_type === "week" && from_date) {
    // Delete 7 days from from_date
    const start = new Date(from_date);
    const end = new Date(from_date);
    end.setDate(start.getDate() + 6);
    from_date = start.toISOString().slice(0, 10);
    to_date = end.toISOString().slice(0, 10);
  } else if (delete_type === "month" && from_date) {
    // Delete whole month of from_date
    const start = new Date(from_date);
    start.setDate(1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    from_date = start.toISOString().slice(0, 10);
    to_date = end.toISOString().slice(0, 10);
  }

  if (!from_date || !to_date) {
    return res
      .status(400)
      .json({ error: "from_date and to_date are required" });
  }

  db.run(
    "DELETE FROM MEAL_MENUS WHERE MENU_DATE >= ? AND MENU_DATE <= ?",
    [from_date, to_date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: this.changes, from_date, to_date });
    }
  );
});

module.exports = router;
