import React from "react";
import PropTypes from "prop-types"; // Import PropTypes for prop validation

const FacultyCard = ({ faculty, darkMode, onEdit, onDelete, isAdmin }) => {
  // Ensure faculty is defined and is an object
  if (!faculty || typeof faculty !== 'object') {
    return <div className="p-4 text-red-500">Faculty data is not available.</div>;
  }

  return (
    <div
      className={`p-6 border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
        darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex items-center mb-4">
        {faculty.pictureURL && (
          <img
            src={faculty.pictureURL}
            alt={`${faculty.name}'s picture`}
            className="w-24 h-24 rounded-full shadow-lg border-2 border-indigo-500 transition-transform transform hover:scale-110"
          />
        )}
        <div className="ml-4">
          <h2 className="text-xl font-bold mb-1">{faculty.name || "No Name Provided"}</h2>
          <p className="text-sm text-gray-500 mb-2">{faculty.email || "No Email Provided"}</p>
          <p className="text-sm mb-2">Faculty ID: {faculty.facultyId || "N/A"}</p>
        </div>
      </div>

      <p className="mb-2">
        <span className="font-semibold">Specialization:</span> {faculty.specializations && faculty.specializations.length > 0 ? faculty.specializations.join(", ") : "N/A"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Bio:</span> {faculty.description || "No Bio Provided"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Phone Number:</span> {faculty.phoneNumber || "N/A"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Status:</span> {faculty.isActive ? "Active" : "Inactive"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Join Date:</span> {faculty.joinDate ? new Date(faculty.joinDate).toLocaleDateString() : "N/A"}
      </p>

      {isAdmin && (
        <div className="mt-4 flex space-x-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 transform hover:scale-105 shadow-lg"
            onClick={onEdit}
            aria-label={`Edit ${faculty.name}`}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 transform hover:scale-105 shadow-lg"
            onClick={onDelete}
            aria-label={`Delete ${faculty.name}`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// Prop validation
FacultyCard.propTypes = {
  faculty: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    facultyId: PropTypes.string.isRequired,
    specializations: PropTypes.arrayOf(PropTypes.string), // Array of specializations
    description: PropTypes.string,
    phoneNumber: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    joinDate: PropTypes.string,
    pictureURL: PropTypes.string,
  }).isRequired,
  darkMode: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default FacultyCard;
