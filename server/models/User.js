const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the schema for the User model
const UserSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true, // Ensures studentId is unique
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    enum:["admin", "student", "member"],
    default:"student"
  },
  participatedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  }],
});

// Create the User model
const User = mongoose.model("User", UserSchema);

module.exports = User;
