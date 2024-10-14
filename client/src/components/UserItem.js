import React from 'react';
import ParticipatedEvents from './ParticipatedEvents'; // Import the participated events component

const UserItem = ({ user, handleEdit, handleDelete, handleParticipatedEvents, events }) => {
  return (
    <li key={user._id} className="flex flex-col p-2 border-b">
      <div className="flex justify-between items-center">
        <div>
          <p>{user.studentId} - {user.name} ({user.email})</p>
          <button onClick={() => handleParticipatedEvents(user._id)} className="text-blue-500">
            {events[user._id] ? 'Hide Participated Events' : 'View Participated Events'}
          </button>
        </div>
        <div>
          <button onClick={() => handleEdit(user)} className="text-green-500 mr-2">Edit</button>
          <button onClick={() => handleDelete(user._id)} className="text-red-500">Delete</button>
        </div>
      </div>
      {events[user._id] && <ParticipatedEvents events={events[user._id]} />} {/* Use the new component */}
    </li>
  );
};

export default UserItem;
