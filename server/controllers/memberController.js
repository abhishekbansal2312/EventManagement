const Member = require("../models/Member");
const mongoose = require('mongoose');

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching members", error: error.message });
  }
};

// Add a new member (Registration)
exports.addMember = async (req, res) => {
  const { name, email, studentId, pictureURL, description, hobbies, phoneNumber, joinDate } = req.body;

  try {
    // Check if the member already exists by email or studentId
    const existingMember = await Member.findOne({
      $or: [{ email }, { studentId }],
    });
    if (existingMember) {
      return res.status(400).json({ message: "Member with this email or student ID already exists" });
    }

    const newMember = new Member({
      name,
      email,
      studentId,
      pictureURL,
      description,
      hobbies,
      phoneNumber,
      joinDate, // Set joinDate manually
    });

    await newMember.save();
    res.status(201).json({ message: "Member registered successfully", member: newMember });
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error: error.message });
  }
};

// Get a specific member by ID
exports.getMember = async (req, res) => {
  const { id } = req.params;

  // Check if id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid member ID" });
  }

  try {
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Error fetching member", error: error.message });
  }
};

// Update a member by ID
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    studentId,
    pictureURL,
    description,
    hobbies,
    isActive,
    phoneNumber,
    joinDate,
  } = req.body;

  try {
    // Check if the email or studentId already exists (excluding the current member)
    const existingMember = await Member.findOne({
      $or: [{ email }, { studentId }],
      _id: { $ne: id },
    });
    if (existingMember) {
      return res.status(400).json({ message: "Email or Student ID already in use" });
    }

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        name,
        email,
        studentId,
        pictureURL,
        description,
        hobbies,
        isActive,
        phoneNumber,
        joinDate, // Update joinDate if provided
      },
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: "Error updating member", error: error.message });
  }
};

// Delete a member by ID
exports.deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMember = await Member.findByIdAndDelete(id);
    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member", error: error.message });
  }
};
