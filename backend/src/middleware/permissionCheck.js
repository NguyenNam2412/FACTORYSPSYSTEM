const db = require("../db").getDB();

async function hasPermission(user, permissionId) {
  // 1. Check user override first
  const override = await new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM USER_PERMISSION_OVERRIDES WHERE USER_ID = ? AND PERMISSION_ID = ?`,
      [user.id, permissionId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
  if (override) return override.ALLOW === 1;

  // 2. Check role permissions
  const rolePerm = await new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM ROLE_PERMISSIONS 
       WHERE ROLE_NAME = ? AND PERMISSION_ID = ? 
       AND (DEPARTMENT_ID IS NULL OR DEPARTMENT_ID = ?)`,
      [user.role, permissionId, user.department_id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
  return !!rolePerm;
}

module.exports = hasPermission;
