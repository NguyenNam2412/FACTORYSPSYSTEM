const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware"); // jwt

router.get("../utils/logs", verifyToken, (req, res) => {
  // admin only
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const logPath = path.join(__dirname, "../utils/logs/query.log");

  fs.readFile(logPath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read log:", err);
      return res.status(500).json({ error: "Failed to read log" });
    }

    const lines = data.trim().split("\n").reverse().slice(0, 100); // get 100 newest line
    return res.json({ logs: lines });
  });
});

module.exports = router;
