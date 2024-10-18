const Task = require("../models/Task");
const mongoose = require("mongoose");
const Event = require("../models/Event");

// Get all tasks for a specific event
exports.getAllTasks = async (req, res) => {
  const { eventId } = req.params; // Destructure eventId from req.params

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const tasks = await Task.find({ event: eventId }) // Find tasks by event ID
      .populate('event') // Populate the event field
      .populate('OnlinePoster.assignedTo') // Populate for each specific sub-task
      .populate('OfflinePoster.assignedTo')
      .populate('CaptionToBeShared.assignedTo')
      .populate('WhatsAppGroupHandling.assignedTo')
      .populate('Announcements.assignedTo')
      .populate('EventReport.assignedTo')
      .populate('StageHandling.assignedTo')
      .populate('ApplicationToBeSigned.assignedTo')
      .populate('PhotographyDuringEvent.assignedTo')
      .populate('Anchoring.assignedTo')
      .populate('BudgetManagement.assignedTo')
      .populate('Decoration.assignedTo')
      .populate('TechnicalSupport.assignedTo')
      .populate('Coordinators.assignedTo')
      .populate('CoCoordinators.assignedTo');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// Add a new task for a specific event
exports.addTask = async (req, res) => {
  const { eventId } = req.params; // Destructure eventId from req.params

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  const {
    deadline,
    status,
    OnlinePoster,
    OfflinePoster,
    CaptionToBeShared,
    WhatsAppGroupHandling,
    Announcements,
    EventReport,
    StageHandling,
    ApplicationToBeSigned,
    PhotographyDuringEvent,
    Anchoring,
    BudgetManagement,
    Decoration,
    TechnicalSupport,
    Coordinators,
    CoCoordinators
  } = req.body;

  try {
    const newTask = new Task({
      event: eventId, // Use the eventId for the new task
      deadline,
      status,
      OnlinePoster,
      OfflinePoster,
      CaptionToBeShared,
      WhatsAppGroupHandling,
      Announcements,
      EventReport,
      StageHandling,
      ApplicationToBeSigned,
      PhotographyDuringEvent,
      Anchoring,
      BudgetManagement,
      Decoration,
      TechnicalSupport,
      Coordinators,
      CoCoordinators,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error: error.message });
  }
};

// Get a specific task by ID under a specific event
exports.getTask = async (req, res) => {
  const { eventId, taskId } = req.params; // Destructure eventId and taskId from req.params

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }
  
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  try {
    const task = await Task.findOne({ _id: taskId, event: eventId }) // Ensure task belongs to the event
      .populate('event') // Populate the event field
      .populate('OnlinePoster.assignedTo')
      .populate('OfflinePoster.assignedTo')
      .populate('CaptionToBeShared.assignedTo')
      .populate('WhatsAppGroupHandling.assignedTo')
      .populate('Announcements.assignedTo')
      .populate('EventReport.assignedTo')
      .populate('StageHandling.assignedTo')
      .populate('ApplicationToBeSigned.assignedTo')
      .populate('PhotographyDuringEvent.assignedTo')
      .populate('Anchoring.assignedTo')
      .populate('BudgetManagement.assignedTo')
      .populate('Decoration.assignedTo')
      .populate('TechnicalSupport.assignedTo')
      .populate('Coordinators.assignedTo')
      .populate('CoCoordinators.assignedTo');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
};

// Update a specific task by ID under a specific event
exports.updateTask = async (req, res) => {
  const { eventId, taskId } = req.params; // Destructure eventId and taskId from req.params

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID." });
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task ID." });
  }

  const {
    deadline,
    status,
    OnlinePoster,
    OfflinePoster,
    CaptionToBeShared,
    WhatsAppGroupHandling,
    Announcements,
    EventReport,
    StageHandling,
    ApplicationToBeSigned,
    PhotographyDuringEvent,
    Anchoring,
    BudgetManagement,
    Decoration,
    TechnicalSupport,
    Coordinators,
    CoCoordinators
  } = req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, event: eventId }, // Ensure task belongs to the event
      {
        deadline,
        status,
        OnlinePoster,
        OfflinePoster,
        CaptionToBeShared,
        WhatsAppGroupHandling,
        Announcements,
        EventReport,
        StageHandling,
        ApplicationToBeSigned,
        PhotographyDuringEvent,
        Anchoring,
        BudgetManagement,
        Decoration,
        TechnicalSupport,
        Coordinators,
        CoCoordinators,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// Delete a specific task by ID under a specific event
exports.deleteTask = async (req, res) => {
  const { eventId, taskId } = req.params; // Destructure eventId and taskId from req.params

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID format" });
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task ID format" });
  }

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, event: eventId }); // Ensure task belongs to the event
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};
