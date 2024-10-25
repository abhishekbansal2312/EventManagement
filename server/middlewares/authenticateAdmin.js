const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  const token = req.cookies.authtoken; // Ensure the token is coming from the correct cookie
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user has the "admin" role
    if (verified.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Attach the decoded token to req.user for further use
    req.user = verified;

    // Optional: Log the verified user only in development or non-production environments
    if (process.env.NODE_ENV !== "production") {
      console.log("Verified Admin:", verified);
    }

    // Check and log the token expiration time
    const expTimestamp = verified.exp;
    if (expTimestamp) {
      const expirationDate = new Date(expTimestamp * 1000); // Convert UNIX timestamp to date
      const options = { timeZone: "Asia/Kolkata" }; // Log expiration date in IST
      if (process.env.NODE_ENV !== "production") {
        console.log("Token Expiration Date:", expirationDate.toLocaleString("en-US", options));
      }
    } else {
      console.log("Token does not have an expiration timestamp.");
    }

    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    // Handle token expiration error specifically
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    // Handle other token-related errors
    return res.status(403).json({ error: "Invalid token." });
  }
};

module.exports = authenticateAdmin;
