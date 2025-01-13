import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaChevronDown } from "react-icons/fa";

const CreateTask = ({ eventId, onClose, darkMode }) => {
  const [formData, setFormData] = useState({
    deadline: "",
    status: "",
    // Task categories with assignedTo
    OnlinePoster: { assignedTo: [] },
    OfflinePoster: { assignedTo: [] },
    CaptionToBeShared: { assignedTo: [] },
    WhatsAppGroupHandling: { assignedTo: [] },
    Announcements: { assignedTo: [] },
    EventReport: { assignedTo: [] },
    StageHandling: { assignedTo: [] },
    ApplicationToBeSigned: { assignedTo: [] },
    PhotographyDuringEvent: { assignedTo: [] },
    Anchoring: { assignedTo: [] },
    BudgetManagement: { assignedTo: [] },
    Decoration: { assignedTo: [] },
    TechnicalSupport: { assignedTo: [] },
    Coordinators: { assignedTo: [] },
    CoCoordinators: { assignedTo: [] },
  });

  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          "https://hobbiesclub-my9i.onrender.com/api/members",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        const data = await response.json();
        setMembers(data);
      } catch (error) {
        toast.error("Error fetching members: " + error.message);
      }
    };

    fetchMembers();
  }, []);

  const handleChange = (e, taskType) => {
    const { value, checked } = e.target;

    setFormData((prevState) => {
      const updatedTask = { ...prevState[taskType] };

      if (checked) {
        if (!updatedTask.assignedTo.includes(value)) {
          updatedTask.assignedTo.push(value);
        }
      } else {
        updatedTask.assignedTo = updatedTask.assignedTo.filter(
          (id) => id !== value
        );
      }

      return { ...prevState, [taskType]: updatedTask };
    });
  };

  const toggleDropdown = (taskType) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [taskType]: !prevState[taskType],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) {
      toast.error("Event ID is required. Please ensure it is provided.");
      return;
    }

    const invalidAssignments = Object.entries(formData).some(
      ([key, task]) =>
        key !== "deadline" && key !== "status" && task.assignedTo.length === 0
    );

    if (invalidAssignments) {
      toast.error("Please assign at least one member to each task type.");
      return;
    }

    try {
      const response = await fetch(
        `https://hobbiesclub-my9i.onrender.com/api/tasks/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      toast.success("Task created successfully!");
      onClose();
    } catch (error) {
      toast.error("Error creating task: " + error.message);
    }
  };

  // Sort members by dateJoined
  const sortedMembers = members.sort(
    (a, b) => new Date(b.dateJoined) - new Date(a.dateJoined)
  );

  // Filter members based on the search query
  const filteredMembers = sortedMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 p-4 rounded-lg ${
        darkMode ? " text-white" : "bg-white text-black"
      }`}
    >
      <div>
        <label className="block text-sm font-medium">Deadline:</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          required
          className={`mt-1 p-2 border rounded-md w-full ${
            darkMode
              ? "bg-gray-700 text-white"
              : "bg-white text-black border-black"
          }`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Status:</label>
        <select
          name="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className={`mt-1 p-2 border rounded-md w-full ${
            darkMode
              ? "bg-gray-700 text-white"
              : "bg-white text-black border-black"
          }`}
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Search Members:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name"
          className={`mt-1 p-2 border rounded-md w-full ${
            darkMode
              ? "bg-gray-700 text-white"
              : "bg-white text-black border-black"
          }`}
        />
      </div>

      {Object.keys(formData).map((taskType) => {
        if (taskType === "deadline" || taskType === "status") return null;

        return (
          <div key={taskType} className="border-b pb-2 mb-4">
            <div className="flex justify-between items-center">
              <label className="text-lg font-medium">
                {taskType.replace(/([A-Z])/g, " $1")}:
              </label>
              <button
                type="button"
                className={`text-sm ${darkMode ? "text-white" : "text-black"}`}
                onClick={() => toggleDropdown(taskType)}
              >
                <FaChevronDown
                  className={`${darkMode ? "text-white" : "text-black"} ${
                    dropdownOpen[taskType] ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {dropdownOpen[taskType] && (
              <ul className="mt-2 space-y-1">
                {filteredMembers.map((member) => (
                  <li
                    key={`${member._id}-${taskType}`}
                    className={`flex items-center ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`member-${member._id}-${taskType}`}
                      value={member._id}
                      checked={
                        formData[taskType]?.assignedTo?.includes(member._id) ||
                        false
                      }
                      onChange={(e) => handleChange(e, taskType)}
                      className={`form-checkbox rounded-lg ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    />
                    <label
                      htmlFor={`member-${member._id}-${taskType}`}
                      className="text-sm ml-2"
                    >
                      {member.name} (ID: {member._id})
                    </label>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-1 text-sm text-gray-400">
              {formData[taskType].assignedTo.length > 0
                ? `Assigned Members: ${formData[taskType].assignedTo.join(
                    ", "
                  )}`
                : "No members assigned"}
            </div>
          </div>
        );
      })}

      <div className="flex justify-between items-center mt-6">
        <button
          type="submit"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
        >
          <FaPlus />
          <span>Create Task</span>
        </button>

        <button
          type="button"
          className="bg-gray-300 text-black px-4 py-2 rounded-lg font-semibold shadow-md"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateTask;
