const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

// MongoDB connection
const MongoDB = process.env.MONGO_URL;

mongoose
  .connect(MongoDB) // Improved options for mongoose connection
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit the process on failure
  });

// CORS options
const corsOptions = {
  origin: "https://mellow-moxie-f15ef2.netlify.app",
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(cookieParser());

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const membersRoute = require("./routes/membersRoute");
const contactRoute = require("./routes/contactRoute");
const eventsRoute = require("./routes/eventsRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/members", membersRoute);
app.use("/api/contact", contactRoute);
app.use("/api/events", eventsRoute);
app.use("/api/faculty", facultyRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reviews", reviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err); // Log the error for debugging
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Start the server
app.listen(4600, () => {
  console.log("Server is running on http://localhost:4600");
});
