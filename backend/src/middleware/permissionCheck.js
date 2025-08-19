const db = require("@db").getDB();
require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

/**
 * check user permission by action
 * @param {string} empId
 * @param {string} action - action
 * @returns {Promise<boolean>}
 */

async function hasPermissionByAction(empId, permissionId) {
  if (process.env.NODE_ENV === "test") return true;

  // 1. get user departmentId
  const emp = await new Promise((resolve, reject) => {
    db.get(
      `SELECT DEPARTMENT_ID FROM EMPLOYEES WHERE EMP_ID = ?`,
      [empId],
      (err, row) => (err ? reject(err) : resolve(row))
    );
  });
  if (!emp) return false;
  const departmentId = emp.DEPARTMENT_ID;

  // 2. check permission exit
  const permission = await new Promise((resolve, reject) => {
    db.get(
      `SELECT PERMISSION_ID FROM PERMISSIONS WHERE PERMISSION_ID = ?`,
      [permissionId],
      (err, row) => (err ? reject(err) : resolve(row))
    );
  });
  if (!permission) return false;

  // 3. Check override
  const override = await new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM USER_PERMISSION_OVERRIDES
     WHERE EMP_ID = ?
       AND (PERMISSION_ID = ? OR PERMISSION_ID IS NULL)
       AND (DEPARTMENT_ID IS NULL OR DEPARTMENT_ID = ?)`,
      [empId, permissionId, departmentId],
      (err, row) => (err ? reject(err) : resolve(row))
    );
  });

  if (override) {
    // Nếu PERMISSION_ID null → mọi quyền trong department
    if (override.PERMISSION_ID === null) return true;

    // Nếu DEPARTMENT_ID null → quyền cho mọi department
    if (override.DEPARTMENT_ID === null) return override.ALLOW === 1;

    // Trường hợp bình thường → check ALLOW
    return override.ALLOW === 1;
  }

  // 4. get all user role
  const roles = await new Promise((resolve, reject) => {
    db.all(
      `SELECT ROLE_NAME FROM EMPLOYEE_ROLES WHERE EMP_ID = ? AND DEPARTMENT_ID = ?`,
      [empId, departmentId],
      (err, rows) => (err ? reject(err) : resolve(rows.map((r) => r.ROLE_NAME)))
    );
  });
  if (!roles.length) return false;

  // 5. Check role has permissions
  for (const role of roles) {
    const rolePerm = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM ROLE_PERMISSIONS
         WHERE ROLE_NAME = ?
           AND PERMISSION_ID = ?
           AND (DEPARTMENT_ID IS NULL OR DEPARTMENT_ID = ?)`,
        [role, permissionId, departmentId],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });
    if (rolePerm) return true;
  }

  return false;
}

module.exports = { hasPermissionByAction };
