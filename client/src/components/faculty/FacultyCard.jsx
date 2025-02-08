import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { FaTrash, FaEdit } from "react-icons/fa";

import Modal from "../Modal"; // Import your modal component
import EditFaculty from "./EditFaculty"; // Import your EditFaculty form component
import { toast } from "react-hot-toast"; // Import toast
import useAxios from "../../utils/useAxios"; // Import useAxios hook
import { useSelector } from "react-redux";

const FacultyCard = ({ faculty, darkMode, onDelete, onUpdate }) => {
  const makeRequest = useAxios();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleUpdateFaculty = async (updatedFaculty) => {
    console.log("Updated faculty:", updatedFaculty);

    try {
      const updatedFacultyData = await makeRequest(
        `http://localhost:4600/api/faculty/${updatedFaculty._id}`,
        "PUT",
        updatedFaculty,
        true // Auth required
      );

      console.log("Faculty updated successfully.");
      setIsEditModalOpen(false);
      toast.success("Faculty details updated successfully.");
      onUpdate(updatedFacultyData); // Update parent state
    } catch (error) {
      console.error("Error updating faculty:", error);
      toast.error("Failed to update faculty. Please try again.");
    }
  };

  return (
    <div className="flex shadow-md rounded-md dark:bg-gray-800 dark:text-white bg-white text-gray-900 relative overflow-hidden">
      {/* Faculty Picture */}
      <div className="flex justify-center bg-gray-100 dark:bg-slate-600 p-2 pt-4">
        {faculty.pictureURL && (
          <img
            src={faculty.pictureURL}
            alt={faculty.name}
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {/* Faculty Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="p-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-gray-700 dark:text-gray-100 font-semibold">
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
            <div className="mb-2 text-[12px]">
              {faculty.email || "No Email Provided"}
            </div>
          </div>
          <hr />

          <div className="text-[12px] mt-2 p-2">
            {faculty.specializations && faculty.specializations.length > 0 && (
              <div className="mb-1">
                <strong>Specializations:</strong>{" "}
                {faculty.specializations.join(", ")}
              </div>
            )}
            {faculty.phoneNumber && (
              <div className="mb-1">
                <strong>Phone:</strong> {faculty.phoneNumber || "N/A"}
              </div>
            )}
            {faculty.joinDate && (
              <div className="mb-2">
                <strong>Join Date:</strong>{" "}
                {new Date(faculty.joinDate).toLocaleDateString() || "N/A"}
              </div>
            )}
            <div className="mt-2">
              <strong className="text-gray-700 dark:text-gray-400">Bio</strong>
              <p className="text-gray-500 dark:text-gray-300 mb-4">
                {faculty.description || "No Bio Provided"}
              </p>
            </div>
          </div>
        </div>

        {user?.role == "admin" && (
          <div className="flex justify-between items-center mt-4 p-2">
            <div className="cursor-pointer" onClick={handleEditClick}>
              <FaEdit
                size={12}
                className="text-blue-500 dark:text-blue-700 hover:text-blue-700"
              />
            </div>
            <div className="cursor-pointer" onClick={onDelete}>
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
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Faculty"
        >
          <EditFaculty
            faculty={faculty}
            onSave={handleUpdateFaculty}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

// Prop validation
FacultyCard.propTypes = {
  faculty: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    specializations: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    phoneNumber: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    joinDate: PropTypes.string,
    pictureURL: PropTypes.string,
  }).isRequired,
  darkMode: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default FacultyCard;
