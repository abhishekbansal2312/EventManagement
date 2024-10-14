const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// Register a new user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

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

