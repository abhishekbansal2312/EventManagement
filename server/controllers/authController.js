const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register a new user
exports.registerUser = async (req, res) => {
  const { studentId, name, email, password, role } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user with the hashed password
    user = await User.create({
      studentId,
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    // More user-friendly message for the client, log error stack in non-production
    if (process.env.NODE_ENV !== "production") {
      console.error("Error during registration:", error.stack);
    }
    res.status(500).json({ message: "Something went wrong!" });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { studentId, password } = req.body;

  try {
    // Check if user exists by studentId
    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Use asynchronous bcrypt.compare instead of compareSync for consistency
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate the token with user data
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        studentId: user.studentId,
      },
      process.env.JWT_SECRET, // Ensure this is always set in the environment
      { expiresIn: "7d" }
    );

    // Set the cookie with the token
    res.cookie("authtoken", token, {
      httpOnly: true, // Cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === "production", // Only secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", // SameSite policy based on environment
    });

    res.json({ token, message: "Login successful" });
  } catch (error) {
    // More user-friendly message for the client, log error stack in non-production
    if (process.env.NODE_ENV !== "production") {
      console.error("Error during login:", error.stack);
    }
    res.status(500).json({ message: "Something went wrong!" });
  }
};
