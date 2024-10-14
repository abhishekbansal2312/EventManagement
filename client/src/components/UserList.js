import React from 'react';
import UserItem from './UserItem';

const UserList = ({ users, handleEdit, handleDelete, handleParticipatedEvents, events }) => {
  return (
    <ul>
      {users.map(user => (
        <UserItem 
          key={user._id} 
          user={user} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
          handleParticipatedEvents={handleParticipatedEvents} 
          events={events} 
        />
      ))}
    </ul>
  );
};

export default UserList;
