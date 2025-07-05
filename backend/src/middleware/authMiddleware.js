const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  const token = bearerHeader && bearerHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = payload; // save user into req
    next(); // continue to route
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "Token expired" });
    }
    return res.status(403).json({ success: false, error: "Invalid token" });
  }
}

module.exports = { verifyToken };
