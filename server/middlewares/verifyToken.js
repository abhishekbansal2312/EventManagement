const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authtoken; // Ensure you're reading the correct cookie
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 

    // Log the decoded token
   
    const expTimestamp = verified.exp;
    if (expTimestamp) {
      const expirationDate = new Date(expTimestamp * 1000); 
      const options = { timeZone: "Asia/Kolkata" }; 
      console.log(expirationDate);
      

      console.log("Token Expiration Date:", expirationDate.toLocaleString("en-US", options));
    } else {
      console.log("Token does not have an expiration timestamp.");
    }

    next(); 
  } catch (err) {
    // Handle token expiration error specifically
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    // Handle other token-related errors
    res.status(403).json({ error: "Invalid token." });
  }
};

module.exports = authenticateToken;
