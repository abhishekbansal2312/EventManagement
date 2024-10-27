import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditTask = ({ eventId, taskId, onClose }) => {
  const [formData, setFormData] = useState({
    deadline: "",
    status: "",
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

  useEffect(() => {
    const fetchData = async () => {
      await fetchMembers();
      await fetchTaskDetails();
    };

    fetchData();
  }, [eventId, taskId]);

  const fetchMembers = async () => {
    try {
      const response = await fetch(
        "https://eventmanagement-b7vf.onrender.com/api/members",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch members");

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      toast.error("Error fetching members: " + error.message);
    }
  };

  const fetchTaskDetails = async () => {
    try {
      const response = await fetch(
        `https://eventmanagement-b7vf.onrender.com/api/tasks/${eventId}/${taskId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch task details");

      const taskData = await response.json();
      const updatedTaskData = {
        deadline: taskData.deadline || "",
        status: taskData.status || "",
        OnlinePoster: { assignedTo: taskData.OnlinePoster?.assignedTo || [] },
        OfflinePoster: { assignedTo: taskData.OfflinePoster?.assignedTo || [] },
        CaptionToBeShared: {
          assignedTo: taskData.CaptionToBeShared?.assignedTo || [],
        },
        WhatsAppGroupHandling: {
          assignedTo: taskData.WhatsAppGroupHandling?.assignedTo || [],
        },
        Announcements: { assignedTo: taskData.Announcements?.assignedTo || [] },
        EventReport: { assignedTo: taskData.EventReport?.assignedTo || [] },
        StageHandling: { assignedTo: taskData.StageHandling?.assignedTo || [] },
        ApplicationToBeSigned: {
          assignedTo: taskData.ApplicationToBeSigned?.assignedTo || [],
        },
        PhotographyDuringEvent: {
          assignedTo: taskData.PhotographyDuringEvent?.assignedTo || [],
        },
        Anchoring: { assignedTo: taskData.Anchoring?.assignedTo || [] },
        BudgetManagement: {
          assignedTo: taskData.BudgetManagement?.assignedTo || [],
        },
        Decoration: { assignedTo: taskData.Decoration?.assignedTo || [] },
        TechnicalSupport: {
          assignedTo: taskData.TechnicalSupport?.assignedTo || [],
        },
        Coordinators: { assignedTo: taskData.Coordinators?.assignedTo || [] },
        CoCoordinators: {
          assignedTo: taskData.CoCoordinators?.assignedTo || [],
        },
      };
      setFormData(updatedTaskData);
    } catch (error) {
      toast.error("Error fetching task details: " + error.message);
    }
  };

  const handleChange = (e, taskType) => {
    const memberId = e.target.value;
    const isChecked = e.target.checked;

    // Get the current assigned members for this taskType
    const currentAssigned = formData[taskType]?.assignedTo || [];

    if (isChecked) {
      // If the member is already assigned, prevent re-assigning
      if (currentAssigned.includes(memberId)) {
        return; // Exit if member is already assigned
      }

      // Assign the member if not already assigned
      const updatedAssigned = [...currentAssigned, memberId];
      setFormData((prev) => ({
        ...prev,
        [taskType]: {
          ...prev[taskType],
          assignedTo: updatedAssigned,
        },
      }));
    } else {
      // Unassign the member
      const updatedAssigned = currentAssigned.filter((id) => id !== memberId);
      setFormData((prev) => ({
        ...prev,
        [taskType]: {
          ...prev[taskType],
          assignedTo: updatedAssigned,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventId || !taskId) {
      toast.error(
        "Event ID and Task ID are required. Please ensure they are provided."
      );
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
        `https://eventmanagement-b7vf.onrender.com/api/tasks/${eventId}/${taskId}`,
        {
          method: "PUT",
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

      toast.success("Task updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Error updating task: " + error.message);
    }
  };

  const sortedMembers = members.sort(
    (a, b) => new Date(b.dateJoined) - new Date(a.dateJoined)
  );
  const filteredMembers = sortedMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Deadline:
        </label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          required
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status:
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Search Members:
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name"
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      {Object.keys(formData).map((taskType) => {
        if (taskType === "deadline" || taskType === "status") return null; // Skip the deadline and status fields
        return (
          <div key={taskType}>
            <label className="block text-sm font-medium text-gray-700">
              {taskType}:
            </label>
            <ul className="mt-2 border border-gray-300 rounded-md">
              {filteredMembers.map((member) => (
                <li
                  key={`${member._id}-${taskType}`}
                  className="flex items-center p-1 hover:bg-gray-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={`member-${member._id}-${taskType}`}
                    value={member._id}
                    checked={
                      formData[taskType]?.assignedTo?.includes(member._id) ||
                      false
                    } // Show previously checked members
                    onChange={(e) => handleChange(e, taskType)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`member-${member._id}-${taskType}`}
                    className="cursor-pointer"
                  >
                    {member.name} (ID: {member._id})
                  </label>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Update Task
        </button>
      </div>
    </form>
  );
};

export default EditTask;
