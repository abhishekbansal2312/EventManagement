const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Ensure this field is required
  },
  description: String,
  date: {
    type: Date,
    required: true, // Ensure this field is required
  },
  time: String,
  location: String,
  link: String,
  isLive: {
    type: Boolean,
    default: false
  },
  onlinePoster: String,
  offlinePoster: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  gallery: [String], // New field for storing multiple image URLs
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
