import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateTask from './CreateTask';
import EditTask from './EditTask';
import Modal from './Modal'; // Ensure you import the Modal component

const EventTasks = ({ tasks, darkMode, eventId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null); // Track hovered member
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isEditing, setIsEditing] = useState(false); // State to track if we are editing
  const [selectedTaskId, setSelectedTaskId] = useState(null); // State to store the selected taskId

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Simulate data fetching
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        toast.error('Error loading tasks: ' + err.message);
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

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'text-gray-900'} py-10`}>
      <ToastContainer />
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
          {isEditing ? <EditTask eventId={eventId} selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} taskId={selectedTaskId} onClose={handleCloseModal}/> : <CreateTask onClose={handleCloseModal} eventId={eventId} />}
        </Modal>
      </div>

      {tasks.length > 0 ? (
        <div className="container mx-auto px-6 md:px-12">
          {tasks.map((task) => {
            const taskEntries = Object.keys(task)
              .filter(
                (key) =>
                  key !== '_id' &&
                  key !== 'event' &&
                  key !== '__v' &&
                  key !== 'deadline' &&
                  key !== 'createdDate' &&
                  key !== 'status'
              )
              .map((key) => {
                const members = task[key]?.assignedTo || [];
                const memberNames =
                  members.length > 0 ? members.map((member) => member.name).join(', ') : 'No members assigned';

                return (
                  <div key={key} className="flex justify-between items-center border-b border-gray-300 py-2">
                    <span className="font-semibold">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span
                      className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}
                      onMouseEnter={() => setHoveredMember(members)}  // Show member details
                      onMouseLeave={() => setHoveredMember(null)}  // Hide member details
                    >
                      {memberNames}
                    </span>

                    {/* Show member details in a tooltip with animation */}
                    {hoveredMember && (
                      <div className={`absolute bg-black text-white p-3 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out ${hoveredMember === members ? 'opacity-100' : 'opacity-0'} z-10`}>
                        <p className="text-sm"><strong>Name:</strong> {members.map(member => member.name).join(', ')}</p>
                        <p className="text-sm"><strong>Number:</strong> {members.map(member => member.phoneNumber || 'N/A').join(', ')}</p>
                      </div>
                    )}
                  </div>
                );
              });

            return (
              <div
                key={task._id}
                className={`shadow-lg p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} hover:shadow-2xl transition-all duration-300 ease-in-out`}
              >
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Deadline:</span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{new Date(task.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Created Date:</span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{new Date(task.createdDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Status:</span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{task.status}</span>
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
