import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserForm from './UserForm'; // Import the UserForm component
import UserList from './UserList'; // Import the UserList component

const Users = ({ darkMode }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get('authtoken');
      const response = await fetch('http://localhost:4600/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('authtoken');
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `http://localhost:4600/api/users/${selectedUser}` : 'http://localhost:4600/api/users';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      if (response.ok) {
        fetchUsers(); // Refresh the list after creation or update
        resetForm();
        toast.success(isEditing ? 'User updated successfully!' : 'User created successfully!');
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user.');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user._id);
    setFormData({ studentId: user.studentId, name: user.name, email: user.email, password: '' });
    setIsEditing(true);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  const handleDelete = async (id) => {
    const token = Cookies.get('authtoken');
    try {
      const response = await fetch(`http://localhost:4600/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
      if (response.ok) {
        fetchUsers(); // Refresh the list after deletion
        toast.success('User deleted successfully!');
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user.');
    }
  };

  const handleParticipatedEvents = async (id) => {
    if (events[id]) {
      setEvents({ ...events, [id]: undefined });
    } else {
      const token = Cookies.get('authtoken');
      try {
        const response = await fetch(`http://localhost:4600/api/users/${id}/participated-events`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        });
        const fetchedEvents = await response.json();
        if (response.ok) {
          setEvents({ ...events, [id]: fetchedEvents });
        } else {
          console.error(fetchedEvents.message);
        }
      } catch (error) {
        console.error('Error fetching participated events:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ studentId: '', name: '', email: '', password: '' });
    setSelectedUser(null);
    setIsEditing(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <input
        type="text"
        placeholder="Search by Name or Student ID"
        value={searchQuery}
        onChange={handleSearchChange}
        className="p-2 border mb-4"
      />
      <UserForm 
        formData={formData} 
        isEditing={isEditing} 
        handleChange={handleChange} 
        handleSubmit={handleSubmit} 
        resetForm={resetForm} 
      />
      <UserList 
        users={filteredUsers} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
        handleParticipatedEvents={handleParticipatedEvents} 
        events={events} 
      />
    </div>
  );
};

export default Users;
