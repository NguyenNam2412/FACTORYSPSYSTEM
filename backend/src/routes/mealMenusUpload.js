const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const XLSX = require("xlsx");

const hasPermission = require("../middleware/permissionCheck");
const verifyToken = require("../middleware/authMiddleware");

const db = require("../db").getDB();
const upload = multer({ storage: multer.memoryStorage() });

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../utils/uploads/menus");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Permission IDs
const PERM_UPLOAD = "MENU_FILE_UPLOAD";
const PERM_DELETE = "MENU_FILE_DELETE";
const PERM_VIEW = "MENU_FILE_VIEW";

// Upload menu Excel file
router.post(
  "/upload",
  verifyToken,
  async (req, res, next) => {
    const user = req.user;
    const canUpload = await hasPermission(user, PERM_UPLOAD);
    if (!canUpload) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  },
  upload.single("file"),
  async (req, res) => {
    const { menu_date, upload_type } = req.body;
    if (!menu_date)
      return res.status(400).json({ error: "MENU_DATE is required" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Date checks
    const today = new Date();
    const inputDate = new Date(menu_date);
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    if (inputDate < today)
      return res.status(400).json({ error: "MENU_DATE cannot be in the past" });

    // Determine period
    let fromDate = new Date(menu_date);
    let toDate = new Date(menu_date);
    let week = 1,
      month = fromDate.getMonth() + 1,
      year = fromDate.getFullYear();
    if (upload_type === "month") {
      fromDate.setDate(1);
      toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
      week = null;
    } else {
      week = Math.ceil((fromDate.getDate() - 1) / 7) + 1;
      toDate.setDate(fromDate.getDate() + 6);
    }
    const formatDate = (d) => d.toISOString().slice(0, 10);
    const from_date_str = formatDate(fromDate);
    const to_date_str = formatDate(toDate);

    // Save file to disk
    const fileName = `menu_${year}_${month}${
      week ? `_w${week}` : ""
    }_${Date.now()}.xlsx`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, req.file.buffer);

    // Save file info to DB
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO MEAL_MENU_FILES (FILE_NAME, YEAR, MONTH, WEEK) VALUES (?, ?, ?, ?)",
        [fileName, year, month, week],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Parse and insert menus as before
    try {
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

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

      const insertPromises = rows.map((row) => {
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
        file: fileName,
        period: { from: from_date_str, to: to_date_str },
        menus: rows,
      });
    } catch (err) {
      res.status(500).json({ error: "Invalid Excel file or data" });
    }
  }
);

// List all menu files grouped by year/month/week
router.get("/files", verifyToken, async (req, res) => {
  const user = req.user;
  const canView = await hasPermission(user, PERM_VIEW);
  if (!canView) {
    return res
      .status(403)
      .json({ error: "Forbidden: insufficient permissions" });
  }
  db.all(
    "SELECT * FROM MEAL_MENU_FILES ORDER BY YEAR DESC, MONTH DESC, WEEK DESC, UPLOADED_AT DESC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      // Group by year > month > week
      const grouped = {};
      rows.forEach((file) => {
        if (!grouped[file.YEAR]) grouped[file.YEAR] = {};
        if (!grouped[file.YEAR][file.MONTH])
          grouped[file.YEAR][file.MONTH] = [];
        grouped[file.YEAR][file.MONTH].push(file);
      });
      res.json(grouped);
    }
  );
});

// Delete a specific menu file
router.delete("/file/:file_id", verifyToken, async (req, res) => {
  const user = req.user;
  const canDelete = await hasPermission(user, PERM_DELETE);
  if (!canDelete) {
    return res
      .status(403)
      .json({ error: "Forbidden: insufficient permissions" });
  }
  const file_id = req.params.file_id;
  db.get(
    "SELECT FILE_NAME FROM MEAL_MENU_FILES WHERE FILE_ID = ?",
    [file_id],
    (err, row) => {
      if (err || !row) return res.status(404).json({ error: "File not found" });
      const filePath = path.join(uploadDir, row.FILE_NAME);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      db.run("DELETE FROM MEAL_MENU_FILES WHERE FILE_ID = ?", [file_id]);
      res.json({ success: true, deleted_file: row.FILE_NAME });
    }
  );
});

// Delete all files in a month
router.delete("/month", verifyToken, async (req, res) => {
  const user = req.user;
  const canDelete = await hasPermission(user, PERM_DELETE);
  if (!canDelete) {
    return res
      .status(403)
      .json({ error: "Forbidden: insufficient permissions" });
  }
  const { year, month } = req.body;
  if (!year || !month)
    return res.status(400).json({ error: "year and month required" });
  db.all(
    "SELECT FILE_NAME FROM MEAL_MENU_FILES WHERE YEAR = ? AND MONTH = ?",
    [year, month],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      rows.forEach((row) => {
        const filePath = path.join(uploadDir, row.FILE_NAME);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      db.run("DELETE FROM MEAL_MENU_FILES WHERE YEAR = ? AND MONTH = ?", [
        year,
        month,
      ]);
      res.json({ success: true, deleted_files: rows.map((r) => r.FILE_NAME) });
    }
  );
});

// Get menu for a specific day
router.get("/by-day/:date", verifyToken, async (req, res) => {
  const user = req.user;
  const canView = await hasPermission(user, PERM_VIEW);
  if (!canView) {
    return res
      .status(403)
      .json({ error: "Forbidden: insufficient permissions" });
  }
  db.all(
    "SELECT * FROM MEAL_MENUS WHERE MENU_DATE = ? ORDER BY MENU_TYPE",
    [req.params.date],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Download File
router.get("/file/:file_id", verifyToken, async (req, res) => {
  const user = req.user;
  const canView = await hasPermission(user, PERM_VIEW);
  if (!canView) {
    return res
      .status(403)
      .json({ error: "Forbidden: insufficient permissions" });
  }
  db.get(
    "SELECT FILE_PATH, FILE_NAME FROM MEAL_MENU_FILES WHERE FILE_ID = ?",
    [req.params.file_id],
    (err, row) => {
      if (err || !row) return res.status(404).json({ error: "File not found" });
      res.download(row.FILE_PATH, row.FILE_NAME);
    }
  );
});

module.exports = router;
