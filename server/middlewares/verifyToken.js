const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

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
