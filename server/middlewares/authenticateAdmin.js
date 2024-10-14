const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  const token = req.cookies.authtoken; // Make sure you're consistent with cookie names
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is an admin
    if (verified.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    req.user = verified; // Attach the decoded token to req.user for further use
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    return res.status(403).json({ error: "Invalid token." });
  }
};

module.exports = authenticateAdmin;
