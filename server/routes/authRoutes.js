const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const authenticateToken = require("../middlewares/verifyToken");

// Register a new user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

router.get("/me", authenticateToken, getMe);
// Logout route (GET request)
router.delete("/logout", (req, res) => {
  res.clearCookie("authtoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
