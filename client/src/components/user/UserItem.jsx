import React, { useState } from "react";
import ParticipatedEvents from "../ParticipatedEvents"; // Import the participated events component
import { FaEdit, FaTrash } from "react-icons/fa";

const UserItem = ({
  user,
  handleEdit,
  handleDelete,
  handleParticipatedEvents,
  events,
  darkMode,
}) => {
  // Track the expanded state for smooth transitions
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleParticipatedEvents = (userId) => {
    setIsExpanded((prev) => !prev);
    handleParticipatedEvents(userId);
  };

  // Calculate the max height for transition
  const maxHeight = events[user._id] ? `${events[user._id].length * 40}px` : "0px";

  return (
    <li
      key={user._id}
      className={`flex flex-col p-2 shadow-md transition duration-300 pb-1`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className={`text-md font-normal flex flex-col`}>
            {user.studentId} | {user.name}
            <span className="text-[12px] text-gray-400">{user.email}</span>
          </p>
          <button
            onClick={() => toggleParticipatedEvents(user._id)}
            className={`mt-1 text-[12px] text-blue-500 hover:text-blue-700 transition-transform duration-200 transform ${isExpanded ? 'scale-95' : 'scale-100'}`}
          >
            {events[user._id]
              ? "Hide Participated Events"
              : "View Participated Events"}
          </button>
        </div>
        <div className="flex space-x-2">
          {/* Edit button with icon */}
          <button
            onClick={() => handleEdit(user)}
            className={`flex items-center px-3 py-1 text-teal-400 border border-teal-400 rounded hover:bg-teal-400 hover:text-white transition duration-200 text-[12px]`}
          >
            <FaEdit className="mr-1" />
            Edit
          </button>

          {/* Delete button with icon */}
          <button
            onClick={() => handleDelete(user._id)}
            className={`flex items-center px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition duration-200 text-[12px]`}
          >
            <FaTrash className="mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Participated Events section with height transition */}
      <div
        className={`transition-all duration-700 ease-in-out overflow-hidden`}
        style={{ maxHeight: isExpanded ? maxHeight : "0px" }} // Control height with style
      >
        {events[user._id] && (
          <div
            className={`mt-2 p-4 rounded-lg transition-opacity duration-700 ease-in-out delay-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} ${
              darkMode ? "dark:bg-gray-700" : "bg-gray-100"
            } shadow-md`}
          >
            <h2
              className={`text-[12px] font-bold ${
                darkMode ? "dark:text-white" : "text-gray-800"
              }`}
            >
              Participated Events
            </h2>
            <ParticipatedEvents events={events[user._id]} />
          </div>
        )}
      </div>
    </li>
  );  
};

export default UserItem;
