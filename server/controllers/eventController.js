const Event = require("../models/Event");
const mongoose = require("mongoose");
const User = require("../models/User");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate(
      "participants",
      "name studentId email"
    );
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
};

// Add a new event
exports.addEvent = async (req, res) => {
  console.log("Request body:", req.body); // Log the request body

  const { title, description, date, time, location, link, onlinePoster, offlinePoster, isLive, gallery} = req.body;

  // Check for required fields
  if (!title || !date) {
    return res.status(400).json({ message: "Title and date are required" });
  }

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      link,
      onlinePoster,
      offlinePoster,
      isLive, // Include isLive here
      gallery
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error adding event:", error); // Log the error for debugging
    res.status(500).json({ message: "Error adding event", error: error }); // Send the full error object
  }
};

// Get a specific event by ID
exports.getEvent = async (req, res) => {
  const { id } = req.params;

  // Check if id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const event = await Event.findById(id).populate(
      "participants",
      "name studentId email"
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
};

// Update an event by ID
exports.updateEvent = async (req, res) => {
  console.log("Request body:", req.body); // Log the request body

  const { id } = req.params;
  const { title, description, date, time, location, link, onlinePoster, offlinePoster, isLive,gallery } = req.body;

  // Check for required fields
  if (!title || !date) {
    return res.status(400).json({ message: "Title and date are required" });
  }

  // Prepare the data to update
  const updateData = {
    title,
    description,
    date,
    time,
    location,
    link,
    onlinePoster,
    offlinePoster,
    isLive, // Include isLive here
    gallery
  };

  // Handle file uploads if they exist
  if (req.file) {
    updateData.onlinePoster = req.file.path; // Adjust based on your file storage
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error); // Log the error for debugging
    res.status(500).json({ message: "Error updating event", error: error.message }); // Send the error message
  }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};

// Add participants by student IDs
exports.addParticipants = async (req, res) => {
  // Destructure eventId from req.params
  const { id: eventId } = req.params; 
  const { studentIds } = req.body;

  console.log("Received request parameters:", req.params, eventId); // Log parameters for debugging

  // Check if the eventId is defined
  if (!eventId) {
    return res.status(400).json({ message: "Event ID is undefined" });
  }

  // Check if the eventId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: `Invalid event ID: ${eventId}` });
  }

  // Check if studentIds is provided
  if (!studentIds || typeof studentIds !== 'string') {
    return res.status(400).json({ message: "Student IDs are required" });
  }

  try {
    // Split studentIds into an array and trim whitespace
    const idsArray = studentIds.split(",").map((id) => id.trim()).filter(Boolean);
    
    // Query for users based on studentIds
    const users = await User.find({ studentId: { $in: idsArray } });

    // If no users are found, return a 404 response
    if (!users.length) {
      return res.status(404).json({ message: "No valid users found for the provided IDs" });
    }

    // Add users' ObjectId to the event's participants
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { participants: users.map((user) => user._id) } },
      { new: true, runValidators: true } // Ensure that validators are run
    ).populate("participants", "name studentId email");

    // Update the participatedEvents array for each user
    await User.updateMany(
      { _id: { $in: users.map((user) => user._id) } },
      { $addToSet: { participatedEvents: eventId } }
    );

    // Respond with the updated event
    res.status(200).json({ message: "Participants added successfully", event });
  } catch (error) {
    console.error("Error adding participants:", error); // Log the error for debugging
    res.status(500).json({ message: "Error adding participants", error: error.message });
  }
};

// Update the gallery of an event
exports.updateEventGallery = async (req, res) => {
  const { id } = req.params; // Get the event ID from the URL
  const { newImages } = req.body; // Expect an array of new image URLs in the request body

  // Validate the input
  if (!Array.isArray(newImages) || newImages.length === 0) {
      return res.status(400).json({ message: "Invalid image data. Must be a non-empty array of URLs." });
  }

  try {
      // Find the event by ID and update the gallery
      const updatedEvent = await Event.findByIdAndUpdate(
          id,
          { $addToSet: { gallery: { $each: newImages } } }, // Add new images to the gallery array, avoiding duplicates
          { new: true } // Return the updated event
      );

      // Check if the event was found and updated
      if (!updatedEvent) {
          return res.status(404).json({ message: "Event not found." });
      }

      // Return the updated event with a success message
      return res.status(200).json({
          message: "Gallery updated successfully.",
          updatedEvent,
      });
  } catch (error) {
      console.error("Error updating gallery:", error);
      // Return a generic error message without exposing sensitive details
      return res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteImageFromGallery = async (req, res) => {
  const { id } = req.params; // Event ID from the URL
  const { imageUrl } = req.body; // Image URL to delete

  // Validate input
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }
  
  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  try {
    // Find the event and remove the image URL from the gallery
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $pull: { gallery: imageUrl } }, // Remove the specified image URL
      { new: true } // Return the updated event
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Image deleted successfully",
      updatedEvent, // Return the updated event
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Error deleting image", error: error.message });
  }
};



