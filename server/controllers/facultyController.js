const FacultyConvener = require("../models/Faculty");
const mongoose = require("mongoose");

// Get all faculty conveners
exports.getAllFacultyConveners = async (req, res) => {
  try {
    const facultyConveners = await FacultyConvener.find();
    res.status(200).json(facultyConveners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty conveners", error: error.message });
  }
};

// Add a new faculty convener (Registration)
exports.addFacultyConvener = async (req, res) => {
  const { name, email, facultyId, pictureURL, designation, department, joinDate, isActive, phoneNumber, description, specializations, hobbies } = req.body;

  try {
    // Check if the faculty convener already exists by email or facultyId
    const existingFacultyConvener = await FacultyConvener.findOne({
      $or: [{ email }, { facultyId }],
    });
    if (existingFacultyConvener) {
      return res.status(400).json({ message: "Faculty convener with this email or faculty ID already exists" });
    }

    const newFacultyConvener = new FacultyConvener({
      name,
      email,
      facultyId,
      pictureURL,
      designation,
      department,
      joinDate, // Set joinDate manually
      isActive,
      phoneNumber,
      description,
      specializations,
      hobbies,
    });

    await newFacultyConvener.save();
    res.status(201).json({ message: "Faculty convener registered successfully", facultyConvener: newFacultyConvener });
  } catch (error) {
    res.status(500).json({ message: "Error adding faculty convener", error: error.message });
  }
};

// Get a specific faculty convener by ID
exports.getFacultyConvener = async (req, res) => {
  const { id } = req.params;

  // Check if id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid faculty convener ID" });
  }

  try {
    const facultyConvener = await FacultyConvener.findById(id);
    if (!facultyConvener) {
      return res.status(404).json({ message: "Faculty convener not found" });
    }

    res.status(200).json(facultyConvener);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty convener", error: error.message });
  }
};

exports.updateFacultyConvener = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    facultyId,
    pictureURL,
    designation,
    department,
    joinDate,
    isActive,
    phoneNumber,
    description,
    specializations,
    hobbies,
  } = req.body;

  try {
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Convert the id to ObjectId
    const objectId = new mongoose.Types.ObjectId(id); // Use 'new' keyword here

    // Check if the email or facultyId already exists (excluding the current convener)
    const existingFacultyConvener = await FacultyConvener.findOne({
      $or: [{ email }, { facultyId }],
      _id: { $ne: objectId }, // Use the converted ObjectId
    });
    if (existingFacultyConvener) {
      return res.status(400).json({ message: "Email or Faculty ID already in use" });
    }

    const updatedFacultyConvener = await FacultyConvener.findByIdAndUpdate(
      objectId, // Use the converted ObjectId here
      {
        name,
        email,
        facultyId,
        pictureURL,
        designation,
        department,
        joinDate, // Update joinDate if provided
        isActive,
        phoneNumber,
        description,
        specializations,
        hobbies,
      },
      { new: true, runValidators: true }
    );

    if (!updatedFacultyConvener) {
      return res.status(404).json({ message: "Faculty convener not found" });
    }

    res.status(200).json(updatedFacultyConvener);
  } catch (error) {
    res.status(500).json({ message: "Error updating faculty convener", error: error.message });
  }
};


// Delete a faculty convener by ID
exports.deleteFacultyConvener = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFacultyConvener = await FacultyConvener.findByIdAndDelete(id);
    if (!deletedFacultyConvener) {
      return res.status(404).json({ message: "Faculty convener not found" });
    }

    res.status(200).json({ message: "Faculty convener deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting faculty convener", error: error.message });
  }
};
