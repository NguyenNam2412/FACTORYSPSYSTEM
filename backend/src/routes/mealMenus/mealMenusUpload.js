const express = require("express");
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");
const dayjs = require("@utils/dateTime/dayjsConfig");

const { getDB } = require("@db");
const { hasPermissionByAction } = require("@middleware/permissionCheck");
// Helper
const getPeriod = require("@helpers/mealMenus/getPeriod");
const parseWeekAndMonth = require("@helpers/fileName/mealMenusFileName");

const upload = multer({ storage: multer.memoryStorage() });

// Permission IDs
const UPLOAD_MEAL_MENU = "UPLOAD_MEAL_MENU";

// Middleware: permission check
async function checkPermission(user, res) {
  const allowed = await hasPermissionByAction(user?.empId, UPLOAD_MEAL_MENU);
  if (!allowed) {
    res.status(403).json({ error: "Forbidden: No permissions" });
    return false;
  }
  return true;
}

// Upload menu Excel file
router.post("/upload", upload.single("file"), async (req, res) => {
  const user = req.user;
  if (!(await checkPermission(user, res))) return;

  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const menu_date = parseWeekAndMonth(file.originalname);
  if (!menu_date)
    return res.status(400).json({ error: "MENU_DATE is required" });

  // Period
  const { from_date_str, to_date_str, week, month, year } =
    getPeriod(menu_date);

  const uploadedAt = Date.now();

  const db = getDB();
  // delete file menu same time, delete old file and menu
  const oldFiles = await new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM MEAL_MENU_FILES WHERE YEAR = ? AND MONTH = ? AND (WEEK = ? OR ? IS NULL)",
      [year, month, week, week],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

  if (oldFiles && oldFiles.length > 0) {
    // Collect all deletion promises
    const deletionPromises = oldFiles.map((oldFile) => {
      return new Promise((resolve, reject) => {
        // Delete from MEAL_MENU_FILES
        db.run(
          "DELETE FROM MEAL_MENU_FILES WHERE FILE_ID = ?",
          [oldFile.FILE_ID],
          function (err) {
            if (err) return reject(err);
            // Delete from MEAL_MENUS
            db.run(
              "DELETE FROM MEAL_MENUS WHERE FILE_ID = ?",
              [oldFile.FILE_ID],
              function (err) {
                if (err) return reject(err);
                else return resolve();
              }
            );
          }
        );
      });
    });
    // Wait for all deletions to complete
    await Promise.all(deletionPromises);
  }

  // Parse and insert menus
  const fileName = `Thực đơn tuần ${week}.T${month}.xlsx`;
  const file_id = await new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO MEAL_MENU_FILES (FILE_NAME, YEAR, MONTH, WEEK, UPLOADED_AT) VALUES (?, ?, ?, ?, ?)",
      [fileName, year, month, week, uploadedAt],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });

  // Parse and save menu single day
  try {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    // turn raw data into structured menuData
    const shift = raw[3][2] || "Ca trưa";
    const startRowIndex = 6;
    const menuData = [];

    const fromDate = dayjs(from_date_str, "DD/MM/YYYY").startOf("day");
    const toDate = dayjs(to_date_str, "DD/MM/YYYY").startOf("day");

    const days = [];
    let current = fromDate;
    while (current.valueOf() <= toDate.valueOf()) {
      if (current.day() !== 0) {
        // 0 = Sunday
        days.push(current.format("DD/MM/YYYY"));
      }
      current = current.add(1, "day");
    }

    days.forEach((menuDateStr, dayIdx) => {
      // approve each dish type (2 row: VI and EN)
      for (let i = startRowIndex; i < raw.length; i += 2) {
        const rowVi = raw[i]; // VI
        const rowEn = raw[i + 1]; // EN

        if (!rowVi || !rowVi[0]) continue; // let row empty

        const dishType = rowVi[0]; // col 0 is dish type
        const colIndex = 1 + dayIdx * 3; // col current day

        // get cell value, including "#N/A"
        const name_vi =
          rowVi[colIndex] !== undefined ? String(rowVi[colIndex]) : "";
        const name_en =
          rowEn && rowEn[colIndex] !== undefined ? String(rowEn[colIndex]) : "";

        if (dishType && (name_vi || name_en)) {
          menuData.push({
            MENU_DATE: menuDateStr,
            SHIFT: shift,
            DISH_TYPE: dishType,
            NAME_VI: name_vi,
            NAME_EN: name_en,
            FILE_ID: file_id,
          });
        }
      }
    });

    // save to DB
    await Promise.all(
      menuData.map(
        (item) =>
          new Promise((resolve, reject) => {
            db.run(
              "INSERT INTO MEAL_MENUS (MENU_DATE, SHIFT, DISH_TYPE, NAME_VI, NAME_EN, FILE_ID) VALUES (?, ?, ?, ?, ?, ?)",
              [
                item.MENU_DATE,
                item.SHIFT,
                item.DISH_TYPE,
                item.NAME_VI,
                item.NAME_EN,
                item.FILE_ID,
              ],
              function (err) {
                if (err) reject(err);
                else resolve();
              }
            );
          })
      )
    );

    res.json({
      success: true,
      file: fileName,
      fileId: file_id,
      uploadedAt,
      period: { from: fromDate.valueOf(), to: toDate.valueOf() },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Invalid Excel file or data", detail: err.message });
  }
});

router.get("/file/:file_id/download", async (req, res) => {
  const user = req.user;
  if (!(await checkPermission(user, res))) return;
  const file_id = req.params.file_id;
  const db = getDB();
  db.get(
    "SELECT * FROM MEAL_MENU_FILES WHERE FILE_ID = ?",
    [file_id],
    async (err, file) => {
      if (err || !file)
        return res.status(404).json({ error: "File not found" });
      // get menus data by file_id
      db.all(
        "SELECT * FROM MEAL_MENUS WHERE FILE_ID = ? ORDER BY MENU_DATE, DISH_TYPE",
        [file_id],
        (err, menus) => {
          if (err) return res.status(500).json({ error: err.message });

          // build excel file content
          // 1. get list of days and dish types
          const days = [];
          const dishTypes = [];
          const dayMap = {};
          menus.forEach((m) => {
            if (!days.includes(m.MENU_DATE)) days.push(m.MENU_DATE);
            if (!dishTypes.includes(m.DISH_TYPE)) dishTypes.push(m.DISH_TYPE);
            if (!dayMap[m.MENU_DATE]) dayMap[m.MENU_DATE] = {};
            dayMap[m.MENU_DATE][m.DISH_TYPE] = m;
          });

          // 2. Build header and data rows
          // Header: STT |  dish type | Thứ 2 (vi) | monday (en) | ...
          const header = ["STT", "Dish Type"];
          days.forEach((d, idx) => {
            header.push(`Thứ ${idx + 2} (vi)`);
            header.push(`Thứ ${idx + 2} (en)`);
          });

          const data = [header];

          // rows 2...: STT | Dish Type | ... | tên món vi | dish name en | ...
          dishTypes.forEach((type, idx) => {
            const row = [idx + 1, type];
            days.forEach((d) => {
              const m = dayMap[d][type] || {};
              row.push(m.NAME_VI || "");
              row.push(m.NAME_EN || "");
            });
            data.push(row);
          });

          // 3. create file Excel
          const ws = XLSX.utils.aoa_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Menus");
          const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
          res.setHeader(
            "Content-Disposition",
            `attachment; filename*=UTF-8''${encodeURIComponent(file.FILE_NAME)}`
          );
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.send(buffer);
        }
      );
    }
  );
});

// delete file and menus by file_id
router.delete("/file/:file_id/delete", async (req, res) => {
  const user = req.user;
  if (!(await checkPermission(user, res))) return;
  const file_id = Number(req.params.file_id);
  const db = getDB();
  db.get(
    "SELECT * FROM MEAL_MENU_FILES WHERE FILE_ID = ?",
    [file_id],
    (err, file) => {
      if (err || !file)
        return res.status(404).json({ error: "File not found" });

      // Delete corresponding menus
      db.run("DELETE FROM MEAL_MENUS WHERE FILE_ID = ?", [file_id]);
      db.run("DELETE FROM MEAL_MENU_FILES WHERE FILE_ID = ?", [file_id]);
      res.json({ success: true, deleted_file: file.FILE_NAME });
    }
  );
});

// delete multiple files and menus
router.delete("/files/delete", async (req, res) => {
  const user = req.user;
  if (!(await checkPermission(user, res))) return;
  const { fileIds } = req.body;
  if (!Array.isArray(fileIds) || fileIds.length === 0) {
    return res.status(400).json({ error: "fileIds must be a non-empty array" });
  }

  const deletedFiles = [];
  for (const file_id of fileIds) {
    await new Promise((resolve) => {
      const db = getDB();
      db.get(
        "SELECT * FROM MEAL_MENU_FILES WHERE FILE_ID = ?",
        [file_id],
        (err, file) => {
          if (!err && file) {
            // Delete corresponding menus
            db.run("DELETE FROM MEAL_MENUS WHERE FILE_ID = ?", [file_id]);
            db.run("DELETE FROM MEAL_MENU_FILES WHERE FILE_ID = ?", [file_id]);
            deletedFiles.push(file.FILE_NAME);
          }
          resolve();
        }
      );
    });
  }
  res.json({ success: true, deleted_files: deletedFiles });
});

module.exports = router;
