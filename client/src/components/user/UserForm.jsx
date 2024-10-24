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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[14px]">
      {/* Student ID */}
      <div className="mb-3">
        <label
          htmlFor="studentId"
          className={`block text-gray-700 dark:text-gray-300 font-semibold mb-1`}
        >
          Student ID
        </label>
        <input
          type="text"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          required
          className={`w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white`}
        />
      </div>

      {/* Name */}
      <div className="mb-3">
        <label
          htmlFor="name"
          className={`block text-gray-700 dark:text-gray-300 font-semibold mb-1`}
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white`}
        />
      </div>

      {/* Email */}
      <div className="mb-3">
        <label
          htmlFor="email"
          className={`block text-gray-700 dark:text-gray-300 font-semibold mb-1`}
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white`}
        />
      </div>

      {/* Password */}
      <div className="mb-3">
        <label
          htmlFor="password"
          className={`block text-gray-700 dark:text-gray-300 font-semibold mb-1`}
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!isEditing} // Make password required only when adding a new user
          className={`w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white`}
        />
      </div>

      {/* User Role Dropdown */}
      <div className="mb-3">
        <label
          htmlFor="role"
          className={`block text-gray-700 dark:text-gray-300 font-semibold mb-1`}
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
      <div className="flex justify-end gap-2 mt-4 col-span-2">
        {/* Secondary Button (Cancel) */}
        <button
          type="button"
          className={`bg-gray-500 hover:bg-gray-700 text-white font-normal py-2 px-4 rounded-md transition-colors duration-300 text-[12px]`}
          onClick={onClose}
        >
          Cancel
        </button>

        {/* Primary Button (Submit) */}
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-md transition-colors duration-300 text-[12px]`}
        >
          {isEditing ? "Update User" : "Add User"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
