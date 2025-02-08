const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authtoken;
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    const errorMessage =
      err.name === "TokenExpiredError" ? "Token expired." : "Invalid token.";
    return res.status(401).json({ error: errorMessage });
  }
};

module.exports = authenticateToken;
