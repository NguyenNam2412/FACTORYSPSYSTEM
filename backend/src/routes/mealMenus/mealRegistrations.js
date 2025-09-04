const express = require("express");
const router = express.Router();

const dayjs = require("@utils/dateTime/dayjsConfig");

const { getDB } = require("@db");
const { hasPermissionByAction } = require("@middleware/permissionCheck");

const XLSX = require("xlsx");
const { verifyToken } = require("@middleware/authMiddleware");

const VIEW_MEAL_REGISTRATION = "VIEW_MEAL_REGISTRATION";

// Middleware: permission check
async function checkPermission(user, res) {
  const allowed = await hasPermissionByAction(user, VIEW_MEAL_REGISTRATION);
  if (!allowed) {
    res.status(403).json({ error: "Forbidden: No permissions" });
    return false;
  }
  return true;
}

function shortArrayByDate(arr, order = "desc") {
  arr.sort((a, b) => {
    const dateA = new Date(a.REG_DATE.split("/").reverse().join("/"));
    const dateB = new Date(b.REG_DATE.split("/").reverse().join("/"));

    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
  return arr;
}

// Get all registrations by emp_id
router.post("/my-reg", verifyToken, (req, res) => {
  const { dish_type } = req.body;
  const user = req.user;
  const emp_id = user?.empId;

  if (!emp_id) {
    return res.status(400).json({ error: "Unauthorized: No emp_id in token" });
  }

  const sql = `SELECT EMP_ID, ${dish_type} FROM MEAL_REGISTRATIONS WHERE EMP_ID = ?`;
  const db = getDB();

  db.get(sql, [emp_id], (err, userReg) => {
    if (err) return res.status(500).json({ error: err.message });
    const empId = userReg.EMP_ID;
    const regData = shortArrayByDate(JSON.parse(userReg[dish_type]) || []);

    const userRegData = {
      empId,
      regData,
    };

    res.json(userRegData);
  });
});

// Get all meal registrations
router.post("/meal-reg", async (req, res) => {
  const { reg_date, dish_type } = req.body;

  const user = req.user;
  const emp_id = user?.empId;

  if (!emp_id) {
    return res.status(401).json({ error: "Unauthorized: No emp_id in token" });
  }

  if (!(await checkPermission(emp_id, res))) return;

  const sql = `SELECT A.EMP_ID, B.${dish_type}, A.FULL_NAME, A.DEPARTMENT_ID 
  FROM EMPLOYEES A RIGHT JOIN MEAL_REGISTRATIONS B 
  ON A.EMP_ID = B.EMP_ID 
  ORDER BY A.DEPARTMENT_ID ASC`;
  const db = getDB();

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const grouped = [];

    rows.forEach((row) => {
      const empId = row.EMP_ID;
      const regData = JSON.parse(row[dish_type]) || [];

      regData.forEach((item) => {
        if (dayjs(reg_date).isSame(dayjs(item.REG_DATE, "DD/MM/YYYY"), "day")) {
          const regObj = {
            EMP_ID: empId,
            FULL_NAME: row.FULL_NAME,
            DEPARTMENT_ID: row.DEPARTMENT_ID,
            REG_DATE: item.REG_DATE,
            QTY: item.QTY,
            NOTE: item.NOTE,
          };
          grouped.push(regObj);
        }
      });
    });

    const result = Object.values(grouped);
    res.json(result);
  });
});

// Export meal registrations to Excel
router.post("/meal-reg/export", async (req, res) => {
  const { reg_date, dish_type } = req.body;
  const user = req.user;
  const emp_id = user?.empId;

  if (!emp_id) {
    return res.status(401).json({ error: "Unauthorized: No emp_id in token" });
  }

  if (!(await checkPermission(user, res))) return;

  const sql = `SELECT A.EMP_ID, B.${dish_type}, A.FULL_NAME, A.DEPARTMENT_ID 
  FROM EMPLOYEES A INNER JOIN MEAL_REGISTRATIONS B 
  ON A.EMP_ID = B.EMP_ID 
  ORDER BY A.DEPARTMENT_ID ASC`;

  const db = getDB();
  db.get(sql, [reg_date], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const grouped = [];

    rows.forEach((row) => {
      const empId = row.EMP_ID;
      const regDate = new Date(JSON.parse(reg_date)).toLocaleDateString(
        "en-GB"
      );
      const regData = JSON.parse(row[dish_type]) || [];

      regData.forEach((item) => {
        if (item.REG_DATE === regDate) {
          const regObj = {
            EMP_ID: empId,
            FULL_NAME: row.FULL_NAME,
            DEPARTMENT_ID: row.DEPARTMENT_ID,
            REG_DATE: item.REG_DATE,
            QTY: item.QTY,
            NOTE: item.NOTE,
          };

          grouped.push(regObj);
        }
      });
    });

    const data = [
      [
        "STT",
        "Ngày tháng",
        "Mã nhân viên",
        "Tên nhân viên",
        "Bộ phận",
        "Ghi chú",
      ], // Header
      ...grouped.map((row, idx) => [
        idx + 1,
        row.REG_DATE,
        row.EMP_ID,
        row.FULL_NAME,
        row.DEPARTMENT_ID,
        row.NOTE,
      ]),
    ];

    console.log(data);
    // create Excel file
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    const regDate = new Date(JSON.parse(reg_date)).toLocaleDateString("en-GB");
    XLSX.utils.book_append_sheet(wb, ws, "Meal Registrations");

    const fileName = `bảng theo dõi số lượng suất ăn ngày ${regDate}.xlsx`;

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  });
});

// update meal assign
router.post("/update", (req, res) => {
  const { dish_type, reg_data } = req.body;
  const user = req.user;
  const emp_id = user?.empId;

  if (!emp_id) {
    return res.status(400).json({ error: "EMP_ID and from_date are required" });
  }

  const allowedDishTypes = ["LUNCH_REG", "DINNER_REG", "LATE_REG"];

  if (!allowedDishTypes.includes(dish_type)) {
    return res.status(400).json({ error: "Invalid dish_type provided." });
  }

  const sql = `INSERT INTO MEAL_REGISTRATIONS (EMP_ID, ${dish_type}) VALUES (?, ?)
      ON CONFLICT(EMP_ID) DO UPDATE SET ${dish_type} = excluded.${dish_type}`;
  const db = getDB();
  db.run(sql, [emp_id, reg_data], (err) => {
    if (err) {
      console.error("SQL error:", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json({ success: true, assigned_data: reg_data });
  });
});

module.exports = router;
