import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import storage functions
import { storage } from "../firebase"; // Import Firebase Storage

const CreateMember = ({ setMembers, setError, darkMode }) => {
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    studentId: "",
    pictureURL: null,
    description: "",
    hobbies: "",
    phoneNumber: "",
    isActive: true, // New property for active status
    joinDate: "", // New property for join date
  });

  const [uploading, setUploading] = useState(false); // To show uploading state
  const [dragging, setDragging] = useState(false); // For drag and drop state

  const handleAddMember = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    if (!newMember.pictureURL) {
      setError("Please upload a picture.");
      return;
    }

    try {
      // Upload the picture to Firebase Storage
      const storageRef = ref(storage, `members/${newMember.pictureURL.name}`); // Create storage reference
      const uploadTask = uploadBytesResumable(storageRef, newMember.pictureURL); // Upload the file

      setUploading(true); // Show uploading state

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can monitor progress here if needed
        },
        (error) => {
          console.error("Error during upload: ", error); // Log upload error
          setError(error.message);
          setUploading(false);
        },
        async () => {
          // Get the picture's URL once the upload is complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL: ", downloadURL); // Log download URL

          // After getting the download URL, save the member data (including the picture URL) to MongoDB
          const response = await fetch("http://localhost:4600/api/members", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newMember.name,
              email: newMember.email,
              studentId: newMember.studentId,
              pictureURL: downloadURL, // Save the picture URL
              description: newMember.description,
              hobbies: newMember.hobbies,
              phoneNumber: newMember.phoneNumber,
              isActive: newMember.isActive, // Include isActive in the request
              joinDate: new Date().toISOString(), // Set join date to the current date
            }),
            credentials: "include",
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.log("Error response from server: ", errorData); // Log server error
            throw new Error(errorData.message || "Failed to add member");
          }

          const data = await response.json();
          console.log("Member added successfully: ", data); // Log success

          // Update the members state with the new member
          setMembers((prevMembers) => [...prevMembers, data.member]);

          // Reset the input fields
          setNewMember({
            name: "",
            email: "",
            studentId: "",
            pictureURL: null,
            description: "",
            hobbies: "",
            phoneNumber: "",
            isActive: true, // Reset isActive to default value
            joinDate: "", // Reset joinDate
          });

          setUploading(false); // Hide uploading state
        }
      );
    } catch (err) {
      console.error("Error adding member: ", err); // Log the error
      setError(err.message);
      setUploading(false);
    }
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setNewMember({ ...newMember, pictureURL: file });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  return (
    <form onSubmit={handleAddMember} className="mb-6 p-6 border rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Enter member name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            required
            className={`w-full p-3 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter member email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            required
            className={`w-full p-3 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          />
        </div>
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID</label>
          <input
            type="text"
            placeholder="Enter student ID"
            value={newMember.studentId}
            onChange={(e) => setNewMember({ ...newMember, studentId: e.target.value })}
            required
            className={`w-full p-3 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            placeholder="Enter a brief description"
            value={newMember.description}
            onChange={(e) => setNewMember({ ...newMember, description: e.target.value })}
            className={`w-full p-3 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700">Hobbies</label>
          <input
            type="text"
            placeholder="Enter hobbies (comma-separated)"
            value={newMember.hobbies}
            onChange={(e) => setNewMember({ ...newMember, hobbies: e.target.value })}
            className={`w-full p-3 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            placeholder="Enter phone number"
            value={newMember.phoneNumber}
            onChange={(e) => setNewMember({ ...newMember, phoneNumber: e.target.value })}
            className={`w-full p-3 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          />
        </div>
        <div>
          <label htmlFor="isActive" className="inline-flex items-center">
            <input
              type="checkbox"
              checked={newMember.isActive}
              onChange={(e) => setNewMember({ ...newMember, isActive: e.target.checked })}
              className="mr-2"
            />
            Is Active
          </label>
        </div>
        <div>
          <label htmlFor="pictureURL" className="block text-sm font-medium text-gray-700">Upload Picture</label>
          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition ${dragging ? "border-blue-500" : "border-gray-300"} ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          >
            <p className="text-center">Drag and drop a picture here</p>
            <p className="text-center text-sm text-gray-500">or</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewMember({ ...newMember, pictureURL: e.target.files[0] })}
              className="hidden" // Hide the default input
            />
            <button
              type="button"
              onClick={() => document.querySelector('input[type="file"]').click()}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Choose File
            </button>
          </div>
        </div>
      </div>

      <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
        {uploading ? "Uploading..." : "Add Member"}
      </button>
    </form>
  );
};

export default CreateMember;
