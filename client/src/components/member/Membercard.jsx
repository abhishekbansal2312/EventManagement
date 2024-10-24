import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaTrash, FaEdit } from "react-icons/fa";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Modal from "../Modal";
import EditMember from "./UpdateMemberForm";

const MemberCard = ({ member, onDelete, setError, setMembers }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [hoverActive, setHoverActive] = useState(false);
  const [activateSection, setActivateSection] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authtoken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.role === "admin");
    }

    const colors = [
      "#C70039",
      "#900C3F",
      "#581845",
      "#FFC300",
      "#33C4FF",
      "#337BFF",
      "#FFDA44",
      "#FFC0CB",
      "#6A1B9A",
      "#1E90FF",
      "#0056b3",
      "#4CAF50",
      "#FFC107",
      "#FF1744",
    ];

    const getRandomColor = () =>
      colors[Math.floor(Math.random() * colors.length)];
    setBgColor(getRandomColor());
  }, []);

  useEffect(() => {}, []);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (!hoverActive) {
      takeTime();
    }
  }, [hoverActive]);

  const takeTime = () => {
    setTimeout(() => {
      if (!hoverActive) {
        setActivateSection(true);
      }
    }, 800);
  };

  return (
    <div
      className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white profile-card flex flex-col group transition-all duration-1000 cursor-pointer border"
      onMouseEnter={() => {
        setHoverActive(true);
        setActivateSection(false);
      }}
      onMouseLeave={() => {
        console.log("called here");
        setHoverActive(false);
      }}
    >
      {/* Contact Section */}
      <div
        className={`flex-grow group-hover:flex-grow-0 transition-all duration-1000 ease-in-out group-hover:h-0 overflow-hidden`}
      >
        <>
          <div
            className={`flex justify-center relative h-24 top-section transition-opacity duration-500 ${
              !hoverActive || !isEditModalOpen ? "opacity-100" : "opacity-0"
            } ${!hoverActive ? "" : ""}`}
            style={{ backgroundColor: bgColor }}
          >
            {member.pictureURL ? (
              <img
                src={member.pictureURL}
                alt={member.name}
                className={`w-24 h-24 object-cover rounded-full absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-0%]`}
              />
            ) : (
              <span
                className={`absolute text-gray-500 w-28 h-28 rounded-full bg-gray-300 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-0%] flex justify-center items-center border-4`}
              >
                No Image
              </span>
            )}
          </div>
          <div
            className={`text-center pt-14 flex flex-col justify-between transition-opacity duration-500 ${
              !hoverActive || !isEditModalOpen ? "opacity-100" : "opacity-0"
            } ${!hoverActive ? "" : ""}`}
          >
            <div className="flex-grow-1">
              <h2 className="text-xl font-semibold mb-1 text-gray-700 dark:text-gray-200">
                {member.name || "Unknown"}
              </h2>
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
              <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">
                {member.email || "Not Available"}
              </p>
              {member.phoneNumber && (
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-300 mb-4">
                  2018 - 2022
                </p>
              )}
            </div>
          </div>
        </>
      </div>

      {/* Detail Section */}
      <div className="text-xs rounded-lg text-left detail-section flex-grow-0 h-0 overflow-hidden group-hover:flex-grow group-hover:flex group-hover:flex-col transition-all duration-1000 ease-in-out">
        <div className="p-4 flex-grow">
          {member.joinDate && (
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              <strong>Join Date:</strong>{" "}
              {new Date(member.joinDate).toLocaleDateString() || "N/A"}
            </p>
          )}
          {member.hobbies && member.hobbies.length > 0 && (
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              <strong>Hobbies:</strong>{" "}
              {member.hobbies.join(", ") || "Not Available"}
            </p>
          )}
          {member.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {member.description}
            </p>
          )}
          <p className="mb-4">
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

      {/* Admin Controls */}
      {isAdmin && <hr className="" />}

      {isAdmin && (
        <div className="grid grid-cols-2 gap-2 p-2 text-[12px] flex-grow-0">
          <button
            onClick={handleEditClick}
            className="flex justify-center items-center bg-teal-500 text-white px-4 py-2 rounded-md shadow hover:bg-teal-600"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(member._id);
            }}
            className="flex justify-center items-center bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      )}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          title="Edit Member"
        >
          <EditMember
            member={member}
            setMembers={setMembers}
            onCancel={handleCloseModal}
            setError={setError}
          />
        </Modal>
      )}
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
    hobbies: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

export default MemberCard;
