import React from "react";

const UserForm = ({
  formData,
  isEditing,
  handleChange,
  handleSubmit,
  darkMode,
  onClose,
}) => {
  return (
    <form onSubmit={handleSubmit} className="">
      {/* Student ID */}
      <div className="mb-3">
        <label
          htmlFor="studentId"
          className={`block mb-1 text-sm ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Student ID
        </label>
        <input
          type="text"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          required
          className={`w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
        />
      </div>

      {/* Name */}
      <div className="mb-3">
        <label
          htmlFor="name"
          className={`block mb-1 text-sm ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
        />
      </div>

      {/* Email */}
      <div className="mb-3">
        <label
          htmlFor="email"
          className={`block mb-1 text-sm ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
        />
      </div>

      {/* Password */}
      <div className="mb-3">
        <label
          htmlFor="password"
          className={`block mb-1 text-sm ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!isEditing} // Make password required only when adding a new user
          className={`w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
        />
      </div>

      {/* User Role Dropdown */}
      <div className="mb-3">
        <label
          htmlFor="role"
          className={`block mb-1 text-sm ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          User Role
        </label>
        <select
          name="role"
          value={formData.role || "student"}
          onChange={handleChange}
          required
          className={`w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-4 space-x-4">
        {/* Secondary Button (Cancel) */}
        <button
          type="button"
          className={`bg-gray-200 text-gray-800 hover:bg-gray-300 px-5 py-2 rounded-lg transition-all duration-300 ease-in-out`}
          onClick={onClose}
        >
          Cancel
        </button>

        {/* Primary Button (Submit) */}
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out`}
        >
          {isEditing ? "Update User" : "Add User"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
