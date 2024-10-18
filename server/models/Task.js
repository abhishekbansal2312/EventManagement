const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  OnlinePoster: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  OfflinePoster: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  CaptionToBeShared: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  WhatsAppGroupHandling: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },  
  Announcements: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  EventReport: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  StageHandling: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  ApplicationToBeSigned: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  PhotographyDuringEvent: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  Anchoring: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  BudgetManagement: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  Decoration: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  TechnicalSupport: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  Coordinators: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
  CoCoordinators: {
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: false, // Changed to false
    }],
  },
});

// Export the model
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
