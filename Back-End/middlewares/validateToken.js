const jwt = require("jsonwebtoken");

function validateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.SECRET);
    req.user = verified;
    console.log(verified);
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
}

module.exports = validateToken;
