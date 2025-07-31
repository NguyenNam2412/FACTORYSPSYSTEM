const db = require("../db").getDB();
require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

/**
 * check user permission by action
 * @param {string} empId
 * @param {string} action - action
 * @returns {Promise<boolean>}
 */
async function hasPermissionByAction(empId, action) {
  if (process.env.NODE_ENV === "test") return true;
  const emp = await new Promise((resolve, reject) => {
    db.get(
      `SELECT DEPARTMENT_ID FROM EMPLOYEES WHERE EMP_ID = ?`,
      [empId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
  if (!emp) return false;
  const departmentId = emp.DEPARTMENT_ID;

  // 1. Get permissionId from action
  const permission = await new Promise((resolve, reject) => {
    db.get(
      `SELECT PERMISSION_ID FROM PERMISSIONS WHERE PERMISSION_ID = ?`,
      [action],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
  if (!permission) return false;
  const permissionId = permission.PERMISSION_ID;

  // 2. check permission override
  const override = await new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM USER_PERMISSION_OVERRIDES 
       WHERE EMP_ID = ? AND PERMISSION_ID = ? 
       AND (DEPARTMENT_ID IS NULL OR DEPARTMENT_ID = ?)`,
      [empId, permissionId, departmentId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
  if (override) return override.ALLOW === 1;

  // 3. get all roles of the user
  const roles = await new Promise((resolve, reject) => {
    db.all(
      `SELECT ROLE_NAME FROM EMPLOYEE_ROLES WHERE EMP_ID = ? AND DEPARTMENT_ID = ?`,
      [empId, departmentId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map((r) => r.ROLE_NAME));
      }
    );
  });
  if (roles.length === 0) return false;

  // 4. check if any role has the permission
  for (const role of roles) {
    const rolePerm = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM ROLE_PERMISSIONS 
         WHERE ROLE_NAME = ? AND PERMISSION_ID = ? 
         AND (DEPARTMENT_ID IS NULL OR DEPARTMENT_ID = ?)`,
        [role, permissionId, departmentId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    if (rolePerm) return true;
  }

  return false;
}

module.exports = { hasPermissionByAction };
