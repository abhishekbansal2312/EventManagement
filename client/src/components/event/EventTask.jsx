import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // Import react-hot-toast
import CreateTask from "../CreateTask";
import EditTask from "./EditTask";
import Modal from "../Modal"; // Ensure you import the Modal component

const EventTasks = ({ tasks, setTasks, darkMode, eventId }) => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isEditing, setIsEditing] = useState(false); // State to track if we are editing
  const [selectedTaskId, setSelectedTaskId] = useState(null); // State to store the selected taskId

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Simulate data fetching
        // Update the tasks state only if tasks prop is available
        setLoading(false);
      } catch (err) {
        toast.error("Error loading tasks: " + err.message); // Use react-hot-toast for error handling
        setLoading(false);
      }
    };

    fetchTasks();
  }, [tasks]);

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setIsEditing(false); // Reset editing state
    setSelectedTaskId(null); // Clear the selected taskId
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } py-10`}
    >
      <div className="flex justify-between mx-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Tasks Overview</h2>

        <div className="flex justify-between mb-4 ">
          <div className="flex-1" /> {/* Spacer to push buttons to the right */}
          {tasks.length === 0 ? (
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => {
                setIsEditing(false);
                setIsModalOpen(true); // Open modal for creating a new task
              }}
            >
              Add Task
            </button>
          ) : (
            <button
              className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              onClick={() => {
                setIsEditing(true);
                setSelectedTaskId(tasks[0]._id); // Set the taskId of the first task for editing
                setIsModalOpen(true); // Open modal for editing a task
              }}
            >
              Edit Task
            </button>
          )}
        </div>

        {/* Modal for creating a new task */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal} // Pass the function here
          title={isEditing ? "Edit Task" : "Create New Task"}
        >
          {isEditing ? (
            <EditTask
            darkMode={darkMode}
            setTasks={setTasks}
              eventId={eventId}
              selectedTaskId={selectedTaskId}
              setSelectedTaskId={setSelectedTaskId}
              onClose={handleCloseModal}
            />
          ) : (
            <CreateTask onClose={handleCloseModal} eventId={eventId} setTasks={setTasks} darkMode={darkMode} />
          )}
        </Modal>
      </div>

      {tasks.length > 0 ? (
        <div className="container mx-auto px-6 md:px-12">
          {tasks.map((task) => {
            const taskEntries = Object.keys(task)
              .filter(
                (key) =>
                  key !== "_id" &&
                  key !== "event" &&
                  key !== "__v" &&
                  key !== "deadline" &&
                  key !== "createdDate" &&
                  key !== "status"
              )
              .map((key) => {
                const members = task[key]?.assignedTo || [];
                const memberNames =
                  members.length > 0
                    ? members.map((member) => member.name).join(", ")
                    : "No members assigned";

                return (
                  <div
                    key={key}
                    className="flex justify-between items-center border-b border-gray-300 py-2"
                  >
                    <span className="font-semibold">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </span>
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {memberNames}
                    </span>
                  </div>
                );
              });

            return (
              <div
                key={task._id}
                className={`shadow-lg p-6 rounded-lg mb-6 ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                } hover:shadow-2xl transition-all duration-300 ease-in-out`}
              >
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Deadline:</span>
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Created Date:</span>
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {new Date(task.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Status:</span>
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>

                <div>{taskEntries}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-lg">No tasks available.</p>
      )}
    </div>
  );
};

export default EventTasks;
