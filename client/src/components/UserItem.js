import React from 'react';
import ParticipatedEvents from './ParticipatedEvents'; // Import the participated events component

const UserItem = ({ user, handleEdit, handleDelete, handleParticipatedEvents, events, darkMode }) => {
  return (
    <li key={user._id} className={`flex flex-col p-4 border-b transition duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-300'} hover:bg-opacity-30 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {user.studentId} - {user.name} ({user.email})
          </p>
          <button
            onClick={() => handleParticipatedEvents(user._id)}
            className={`mt-1 text-blue-500 hover:text-blue-700 transition duration-200`}
          >
            {events[user._id] ? 'Hide Participated Events' : 'View Participated Events'}
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(user)}
            className={`px-3 py-1 text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-white transition duration-200`}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(user._id)}
            className={`px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition duration-200`}
          >
            Delete
          </button>
        </div>
      </div>
      {events[user._id] && (
        <div className={`mt-2 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
          <h2 className={`text-center text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Participated Events</h2>
          <ParticipatedEvents events={events[user._id]} />
        </div>
      )}
    </li>
  );
};

export default UserItem;
