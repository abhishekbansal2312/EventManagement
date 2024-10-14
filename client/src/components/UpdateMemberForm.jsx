import React, { useState } from "react";

const UpdateMemberForm = ({ member, onUpdate, onCancel, darkMode }) => {
  const [updatedMember, setUpdatedMember] = useState({ ...member });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:4600/api/members/${member._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMember),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update member");
      }

      const updatedData = await response.json(); // Assuming the updated member is returned
      onUpdate(updatedData); // Call the onUpdate function with the updated member data
      alert(`${updatedData.name} has been updated successfully.`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-lg shadow-md">
      {/* Form fields here remain unchanged */}
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Enter new member name"
          value={updatedMember.name}
          onChange={(e) => setUpdatedMember({ ...updatedMember, name: e.target.value })}
          required
          className={`w-full p-2 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Enter new member email"
          value={updatedMember.email}
          onChange={(e) => setUpdatedMember({ ...updatedMember, email: e.target.value })}
          required
          className={`w-full p-2 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        />
      </div>
      <div>
        <label htmlFor="studentId">Student ID</label>
        <input
          type="text"
          placeholder="Enter new student ID"
          value={updatedMember.studentId}
          onChange={(e) => setUpdatedMember({ ...updatedMember, studentId: e.target.value })}
          required
          className={`w-full p-2 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          placeholder="Enter new description"
          value={updatedMember.description}
          onChange={(e) => setUpdatedMember({ ...updatedMember, description: e.target.value })}
          className={`w-full p-2 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        />
      </div>
      <div>
        <label htmlFor="hobbies">Hobbies</label>
        <input
          type="text"
          placeholder="Enter new hobbies (comma-separated)"
          value={updatedMember.hobbies.join(", ")}
          onChange={(e) => setUpdatedMember({ ...updatedMember, hobbies: e.target.value ? e.target.value.split(", ").map(hobby => hobby.trim()) : [] })}
          className={`w-full p-2 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        />
      </div>
      <div>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          placeholder="Enter new phone number"
          value={updatedMember.phoneNumber}
          onChange={(e) => setUpdatedMember({ ...updatedMember, phoneNumber: e.target.value })}
          className={`w-full p-2 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        />
      </div>
      <div>
        <label htmlFor="isActive" className="inline-flex items-center">
          <input
            type="checkbox"
            checked={updatedMember.isActive}
            onChange={(e) => setUpdatedMember({ ...updatedMember, isActive: e.target.checked })}
            className="mr-2"
          />
          Is Active
        </label>
      </div>
      <div>
        <label htmlFor="joinDate">Join Date</label>
        <input
          type="date"
          value={new Date(updatedMember.joinDate).toISOString().substring(0, 10)} // Convert joinDate to YYYY-MM-DD format
          onChange={(e) => setUpdatedMember({ ...updatedMember, joinDate: e.target.value })}
          className={`w-full p-2 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        />
      </div>
      <div className="flex justify-between mt-4">
        <button type="submit" className={`bg-blue-500 text-white px-3 py-1 rounded ${darkMode ? "hover:bg-blue-600" : "hover:bg-blue-700"}`}>
          Update
        </button>
        <button type="button" onClick={onCancel} className={`bg-gray-500 text-white px-3 py-1 rounded ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-700"}`}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UpdateMemberForm;
