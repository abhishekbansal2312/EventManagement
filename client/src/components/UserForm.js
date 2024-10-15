import React from 'react';

const UserForm = ({ formData, isEditing, handleChange, handleSubmit, darkMode }) => {
  return (
    <form onSubmit={handleSubmit} className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-4 rounded-lg shadow-md`}>
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit User' : 'Add New User'}</h2>
      <div className="mb-4">
        <label htmlFor="studentId" className="block mb-1">Student ID</label>
        <input
          type="text"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!isEditing} // Make password required only when adding a new user
          className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>
      {/* Dropdown for User Role with "Student" as the default selected option */}
      <div className="mb-4">
        <label htmlFor="role" className="block mb-1">User Role</label>
        <select
          name="role"
          value={formData.role || 'student'} // Default to 'student'
          onChange={handleChange}
          className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          required
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Render the button based on editing state */}
      <button
        type="submit"
        className={`w-full p-2 rounded ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} hover:bg-blue-700`}
      >
        {isEditing ? 'Update User' : 'Add User'}
      </button>
    </form>
  );
};

export default UserForm;
