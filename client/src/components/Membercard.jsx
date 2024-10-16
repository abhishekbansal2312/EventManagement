import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTrash, FaEdit } from "react-icons/fa";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Modal from "./Modal";
import EditMember from "./UpdateMemberForm";

const MemberCard = ({ member, onDelete, setError }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = Cookies.get("authtoken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.role === "admin");
    }
  }, []);

  const handleDeleteMember = async (e) => {
    e.stopPropagation();

    try {
      const response = await fetch(
        `http://localhost:4600/api/member/${member._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        onDelete(member._id);
        alert("Member deleted successfully.");
      } else {
        const errorText = await response.text();
        setErrorMessage("Failed to delete member. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while deleting the member.");
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleSaveMember = async (updatedMember) => {
    setIsEditModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white profile-card flex flex-col">
      {/* Member Picture */}
      <div className="flex justify-center relative bg-[#5046e5] h-32 top-section">
        {member.pictureURL ? (
          <img
            src={member.pictureURL}
            alt={member.name}
            className="w-28 h-28 object-cover rounded-full absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-0%] border-4 border-[#5046e5]"
          />
        ) : (
          <span className="absolute text-gray-500 w-28 h-28 rounded-full bg-gray-300 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-0%] flex justify-center items-center border-4 border-[#5046e5]">
            No Image
          </span>
        )}
      </div>

      {/* Member Information */}
      <div className=" flex-grow text-center pt-14 flex flex-col justify-between bottom-section">
        <div className="flex-grow-1">
          {/* Member Name */}
          <h2 className="text-xl font-semibold mb-1">
            {member.name || "Unknown"}
          </h2>

          {/* Member Specializations */}
          {member.specializations && member.specializations.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              <strong>Specializations:</strong>{" "}
              {member.specializations.join(", ")}
            </p>
          )}
          {member.phoneNumber && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
              {member.phoneNumber}
            </p>
          )}
          {/* Member Email */}
          <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">
            {member.email || "Not Available"}
          </p>
          {/* Member Phone */}

          {member.phoneNumber && (
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-300 mb-2">
              2018 - 2022
            </p>
          )}
          <hr className="my-4" />
          <div className="px-2 text-xs text-left">
            {/* Member Join Date */}
            {member.joinDate && (
              <p className=" text-gray-600 dark:text-gray-300 mb-2">
                <strong>Join Date:</strong>{" "}
                {new Date(member.joinDate).toLocaleDateString() || "N/A"}
              </p>
            )}

            {/* Member Hobbies */}
            {member.hobbies && (
              <p className=" text-gray-600 dark:text-gray-300 mb-2">
                <strong>Hobbies:</strong> {member.hobbies || "Not Available"}
              </p>
            )}

            {/* Member Bio */}
            {member.description && (
              <p className=" text-gray-600 dark:text-gray-300 mb-4">
                {member.description}
              </p>
            )}

            {/* Status */}
            <p className=" mb-4">
              Status:{" "}
              <span
                className={`${
                  member.isActive ? "text-green-500" : "text-red-500"
                } font-semibold`}
              >
                {member.isActive ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>
        {/* Edit/Delete Buttons for Admins */}
        {isAdmin && (
          <div className=" grid grid-cols-2 gap-2 p-2 text-[12px] flex-grow-0">
            <button
              onClick={handleEditClick}
              className="flex justify-center items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
            >
              <FaEdit className="mr-2" /> Edit
            </button>
            <button
              onClick={handleDeleteMember}
              className="flex justify-center items-center bg-yellow-400 text-black px-4 py-2 rounded-md shadow hover:bg-yellow-300"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          title="Edit Member"
        >
          <EditMember
            member={member}
            onUpdate={handleSaveMember}
            onCancel={handleCloseModal}
            setError={setError}
          />
        </Modal>
      )}

      {/* Error Message */}
      {/* {errorMessage && (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      )} */}
    </div>
  );
};

// Prop validation
MemberCard.propTypes = {
  member: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    specializations: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    phoneNumber: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    joinDate: PropTypes.string,
    pictureURL: PropTypes.string,
    hobbies: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

export default MemberCard;
