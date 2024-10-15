import React, { useState } from "react";
import UpdateMemberForm from "./UpdateMemberForm"; // Import the update form component

const MemberCard = ({ member, darkMode, setMembers, isAdmin }) => {
  const [isUpdating, setIsUpdating] = useState(false); // State to manage updating mode

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      try {
        const response = await fetch(`http://localhost:4600/api/members/${member._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to delete member");
        }

        setMembers((prevMembers) => prevMembers.filter((m) => m._id !== member._id));
        alert(`${member.name} has been deleted.`);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleEdit = () => {
    setIsUpdating((prev) => !prev); // Toggle updating state
  };

  const timeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const months = Math.floor(diffInSeconds / 2592000);
    const years = Math.floor(diffInSeconds / 31536000);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

    return 'Just now';
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg transition-transform duration-300 transform hover:scale-105 ${
        darkMode ? "bg-gradient-to-br from-gray-800 to-gray-700 text-white" : "bg-gradient-to-br from-white to-gray-200 text-gray-900"
      } hover:shadow-2xl`}
      style={{ border: `1px solid ${darkMode ? "#444" : "#ddd"}`, backdropFilter: "blur(10px)" }}
    >
      <div className="flex items-center mb-4">
        {member.pictureURL ? (
          <img
            src={member.pictureURL}
            alt={member.name}
            className={`w-24 h-24 object-cover rounded-full border-4 mr-6 shadow-lg transition-transform duration-300 hover:scale-110 ${
              darkMode ? "border-gray-700" : "border-gray-300"
            }`}
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mr-6 shadow-lg">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        <div>
          <h3 className={`text-2xl font-bold mb-1 transition-all duration-200 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            {member.name}
          </h3>
          <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
            {member.description}
          </p>
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Hobbies: {member.hobbies.join(", ")}
          </p>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Joined: {timeAgo(member.joinDate)}
          </p>
          <p className={`text-sm ${darkMode ? "text-green-400" : "text-green-600"}`}>
            Status: {member.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      {/* Update and Delete Buttons */}
      {isAdmin && (
        <div className="flex justify-between mt-6">
          <button
            onClick={handleEdit}
            className={`py-2 px-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
            }`}
          >
            {isUpdating ? "Cancel" : "Update"}
          </button>
          <button
            onClick={handleDelete}
            className={`py-2 px-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none ${
              darkMode
                ? "bg-red-600 hover:bg-red-700 text-white shadow-md"
                : "bg-red-500 hover:bg-red-600 text-white shadow-md"
            }`}
          >
            Delete
          </button>
        </div>
      )}

      {/* Conditional rendering of UpdateMemberForm */}
      {isUpdating && (
        <UpdateMemberForm
          member={member}
          onUpdate={(updatedMember) => {
            setMembers((prevMembers) => 
              prevMembers.map((m) => (m._id === updatedMember._id ? updatedMember : m))
            );
            setIsUpdating(false);
          }}
          onCancel={() => setIsUpdating(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default MemberCard;

