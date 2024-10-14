import React from 'react';

const UserForm = ({ formData, isEditing, handleChange, handleSubmit, resetForm }) => {
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        name="studentId"
        value={formData.studentId}
        onChange={handleChange}
        placeholder="Student ID"
        required
        className="p-2 border mb-2"
      />
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
        className="p-2 border mb-2"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="p-2 border mb-2"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="p-2 border mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        {isEditing ? 'Update User' : 'Create User'}
      </button>
      <button type="button" onClick={resetForm} className="ml-2 bg-gray-300 p-2">
        Cancel
      </button>
    </form>
  );
};

export default UserForm;
