import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Use default import for jwt-decode
import Modal from "./Modal"; // Import your modal component
import EditFaculty from "./EditFaculty"; // Import your EditFaculty form component

const FacultyCard = ({ faculty, darkMode, onDelete }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is admin
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Control modal visibility
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  useEffect(() => {
    const token = Cookies.get("authtoken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.role === "admin"); // Set isAdmin based on role
    }
  }, []);

  // Handle faculty deletion
  const handleDeleteFaculty = async (e) => {
    e.stopPropagation(); // Prevent card click
    console.log("Delete button clicked for faculty:", faculty._id); // Debug log

    try {
      const response = await fetch(
        `http://localhost:4600/api/faculty/${faculty._id}`, // Use _id instead of facultyId
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      console.log("Response Status:", response.status); // Debug log

      if (response.ok) {
        console.log("Faculty deleted successfully:", faculty._id); // Debug log
        onDelete(faculty._id); // Notify parent component that faculty is deleted
        alert("Faculty deleted successfully."); // Inform user about successful deletion
      } else {
        const errorText = await response.text();
        console.error("Error deleting faculty:", errorText);
        setErrorMessage("Failed to delete faculty. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting faculty:", error);
      setErrorMessage("An error occurred while deleting the faculty.");
    }
  };

  // Toggle edit modal
  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent card click
    setIsEditModalOpen(true); // Open edit modal
  };

  const handleSaveFaculty = async (updatedFaculty) => {
    console.log("Updated faculty:", updatedFaculty); // Debugging

    try {
      // Call the API to update faculty details using _id
      const response = await fetch(
        `http://localhost:4600/api/faculty/${updatedFaculty._id}`, // Use _id here
        {
          method: "PUT", // Use PUT method for updating
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedFaculty), // Convert updatedFaculty to JSON
        }
      );

      if (response.ok) {
        console.log("Faculty updated successfully.");
        setIsEditModalOpen(false); // Close the modal after successful save
        alert("Faculty details updated successfully.");
      } else {
        const errorText = await response.text();
        console.error("Failed to update faculty:", errorText);
        setErrorMessage("Failed to update faculty. Please try again.");
      }
    } catch (error) {
      console.error("Error updating faculty:", error);
      setErrorMessage("An error occurred while updating the faculty.");
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false); // Close the modal
  };

  return (
    <div className="flex shadow-md rounded-md dark:bg-gray-800 dark:text-white bg-white text-gray-900 relative overflow-hidden">
      {/* Faculty Picture */}
      <div className="flex justify-center bg-gray-100 dark:bg-slate-500 p-2 pt-4">
        {faculty.pictureURL && (
          <img
            src={faculty.pictureURL}
            alt={faculty.name}
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
            onClick={(e) => e.stopPropagation()} // Prevent card click on image click
          />
        )}
      </div>

      {/* Faculty Information */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          {/* Faculty Name */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-gray-700 dark:text-gray-400 font-semibold">
              {faculty.name || "No Name Provided"}
            </h2>
            <span
              className={`${
                faculty.isActive ? "text-green-500" : "text-gray-500"
              } rounded-md text-[12px] font-bold`}
            >
              {faculty.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="text-[12px] mt-2">
            {/* Faculty Email */}
            <div className="mb-1">
              <strong>Email:</strong> {faculty.email || "No Email Provided"}
            </div>

            {/* Faculty Specializations */}
            {faculty.specializations && faculty.specializations.length > 0 && (
              <div className="mb-1">
                <strong>Specializations:</strong>{" "}
                {faculty.specializations.join(", ")}
              </div>
            )}

            {/* Faculty Phone */}
            {faculty.phoneNumber && (
              <div className="mb-1">
                <strong>Phone:</strong> {faculty.phoneNumber || "N/A"}
              </div>
            )}

            {/* Faculty Join Date */}
            {faculty.joinDate && (
              <div className="mb-2">
                <strong>Join Date:</strong>{" "}
                {new Date(faculty.joinDate).toLocaleDateString() || "N/A"}
              </div>
            )}
            <hr />
            {/* Faculty Bio */}
            <div className="mt-2">
              <strong className="text-gray-700 dark:text-gray-400">Bio</strong>
              <p className="text-gray-500 dark:text-gray-300 mb-4">
                {faculty.description || "No Bio Provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit/Delete Buttons for Admins */}
        {isAdmin && (
          <div className="flex justify-between items-center mt-4">
            <div className="cursor-pointer" onClick={handleEditClick}>
              <FaEdit
                size={12}
                className="text-blue-500 dark:text-blue-700 hover:text-blue-700"
              />
            </div>
            <div className="cursor-pointer" onClick={handleDeleteFaculty}>
              <FaTrash
                size={12}
                className="text-red-500 dark:text-red-700 hover:text-red-700"
              />
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          title="Edit Faculty"
        >
          <EditFaculty
            faculty={faculty}
            onSave={handleSaveFaculty}
            onCancel={handleCloseModal}
            darkMode={darkMode}
          />
        </Modal>
      )}

      {/* Error Message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

// Prop validation
FacultyCard.propTypes = {
  faculty: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Use _id as required
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    specializations: PropTypes.arrayOf(PropTypes.string), // Array of specializations
    description: PropTypes.string,
    phoneNumber: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    joinDate: PropTypes.string,
    pictureURL: PropTypes.string,
  }).isRequired,
  darkMode: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FacultyCard;
