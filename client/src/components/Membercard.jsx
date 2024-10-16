import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTrash, FaEdit } from "react-icons/fa";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Modal from "./Modal"; // Import the Modal component
import EditMember from "./UpdateMemberForm"; // Import your EditMember form component

const MemberCard = ({ member, darkMode, onDelete ,setError }) => {
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Control modal visibility
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  useEffect(() => {
    const token = Cookies.get("authtoken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.role === "admin"); // Check if the user is an admin
    }
  }, []);

  // Handle member deletion
  const handleDeleteMember = async (e) => {
    e.stopPropagation(); // Prevent card click
    console.log("Delete button clicked for member:", member._id); // Debug log

    try {
      const response = await fetch(
        `http://localhost:4600/api/member/${member._id}`, // Replace with your API endpoint
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Member deleted successfully:", member._id);
        onDelete(member._id); // Notify parent component
        alert("Member deleted successfully.");
      } else {
        const errorText = await response.text();
        console.error("Error deleting member:", errorText);
        setErrorMessage("Failed to delete member. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      setErrorMessage("An error occurred while deleting the member.");
    }
  };

  // Toggle edit modal
  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditModalOpen(true); // Open edit modal
  };

  const handleSaveMember = async (updatedMember) => {
    // console.log("Updated member:", updatedMember); // Debugging//'/'/'
  
    // try {
    //   const response = await fetch(
    //     `http://localhost:4600/api/members/${updatedMember._id}`, // Use the plural 'members' endpoint
    //     {
    //       method: "PUT", // Use PUT for updating
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       credentials: "include",
    //       body: JSON.stringify(updatedMember),
    //     }
    //   );
  
    //   if (response.ok) {
    //     console.log("Member updated successfully.");
    //     setIsEditModalOpen(false); // Close modal on success
    //     alert("Member details updated successfully.");
    //     // Optionally, you can update the member state in the parent component
    //     // if you are managing members in the parent state
    //   } else {
    //     const errorText = await response.text();
    //     console.error("Failed to update member:", errorText);
    //     setErrorMessage("Failed to update member. Please try again.");
    //   }
    // } catch (error) {
    //   console.error("Error updating member:", error);
    //   setErrorMessage("An error occurred while updating the member.");
    // }
  };
  

  const handleCloseModal = () => {
    setIsEditModalOpen(false); // Close modal
  };

  return (
    <div
      className={`flex shadow-md rounded-md ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } relative overflow-hidden`}
    >
      {/* Member Picture */}
      <div className="flex justify-center mt-4">
        {member.pictureURL && (
          <img
            src={member.pictureURL}
            alt={member.name}
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
            onClick={(e) => e.stopPropagation()} // Prevent card click on image click
          />
        )}
      </div>

      {/* Member Information */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          {/* Member Name */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-gray-700 dark:text-gray-400 font-semibold">
              {member.name || "No Name Provided"}
            </h2>
            <span
              className={`${
                member.isActive ? "text-green-500" : "text-gray-500"
              } rounded-md text-[12px] font-bold`}
            >
              {member.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="text-[12px] mt-2">
            {/* Member Email */}
            <div className="mb-1">
              <strong>Email:</strong> {member.email || "No Email Provided"}
            </div>

            {/* Member Specializations */}
            {member.specializations && member.specializations.length > 0 && (
              <div className="mb-1">
                <strong>Specializations:</strong>{" "}
                {member.specializations.join(", ")}
              </div>
            )}

            {/* Member Phone */}
            {member.phoneNumber && (
              <div className="mb-1">
                <strong>Phone:</strong> {member.phoneNumber || "N/A"}
              </div>
            )}

            {/* Member Join Date */}
            {member.joinDate && (
              <div className="mb-1">
                <strong>Join Date:</strong>{" "}
                {new Date(member.joinDate).toLocaleDateString() || "N/A"}
              </div>
            )}
            {member.hobbies && (
              <div className="mb-1">
                <strong>Hobbies:</strong>{" "}
                {(member.hobbies) || "N/A"}
              </div>
            )}


            {/* Member Bio */}
            <div className="mt-2">
              <strong className="text-gray-700 dark:text-gray-400">Bio</strong>
              <p className="text-gray-500 dark:text-gray-300 mb-4">
                {member.description || "No Bio Provided"}
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
            <div className="cursor-pointer" onClick={handleDeleteMember}>
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
        <Modal isOpen={isEditModalOpen} onClose={handleCloseModal} title="Edit Member">
          <EditMember
          setError={setError}
            member={member}
            onUpdate={handleSaveMember} // Pass handleSaveMember to EditMember
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
MemberCard.propTypes = {
  member: PropTypes.shape({
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

export default MemberCard;
