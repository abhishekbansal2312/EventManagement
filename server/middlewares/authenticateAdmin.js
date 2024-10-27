const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  // Retrieve the token from the cookie named 'authtoken'
  const token = req.cookies.authtoken;

  // If no token is found, return a 401 status
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the JWT secret from environment variables
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the user has the 'admin' role
    if (verified.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Attach the decoded token data to req.user for further use
    req.user = verified;

    // Log the verified user if in a non-production environment
    if (process.env.NODE_ENV !== "production") {
      console.log("Verified Admin:", verified);
    }

    // Optional: Log token expiration date in IST
    const expTimestamp = verified.exp;
    if (expTimestamp) {
      const expirationDate = new Date(expTimestamp * 1000); // Convert UNIX timestamp to date
      const options = { timeZone: "Asia/Kolkata" }; // Use IST timezone
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "Token Expiration Date:",
          expirationDate.toLocaleString("en-US", options)
        );
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
