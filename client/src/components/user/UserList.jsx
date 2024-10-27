import React from 'react';
import UserItem from './UserItem';
import { toast } from 'react-hot-toast'; // Added this line

const UserList = ({ users, handleEdit, handleDelete, handleParticipatedEvents, darkMode, events }) => {
  return (
    <ul className="w-full gap-2 ">
      {users.map(user => (
        <UserItem 
          key={user._id} 
          user={user} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
          handleParticipatedEvents={handleParticipatedEvents} 
          events={events} 
          darkMode={darkMode}
        />
      ))}
    </ul>
  );
};

export default UserList;
