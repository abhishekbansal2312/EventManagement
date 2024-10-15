const mongoose = require("mongoose");

const facultyConvenerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email must be unique
  },
  facultyId: {
    type: String,
  },
  pictureURL: {
    type: String, // Store the URL of the picture
  },
  designation: {
    type: String, // Example: Assistant Professor, Head of Department, etc.
  },
  department: {
    type: String, // Example: Computer Science, Electronics, etc.
  },
  joinDate: {
    type: Date, // Date when the faculty member joined
    // No default value, must be set manually
  },
  isActive: {
    type: Boolean, // Active status of the faculty convener
    default: true,
  },
  phoneNumber: {
    type: String, // Phone number as a string
  },
  description: {
    type: String, // A brief description of the faculty convener or coordinator
  },
  specializations: {
    type: [String], // An array to store faculty's area of expertise or specialization
  },
  hobbies: {
    type: [String], // An array of strings to store hobbies
  },
});

const FacultyConvener = mongoose.model("FacultyConvener", facultyConvenerSchema);

module.exports = FacultyConvener;
