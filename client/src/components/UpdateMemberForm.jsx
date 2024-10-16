import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const UpdateMember = ({ member, setMembers, setError, darkMode }) => {
  const [updatedMember, setUpdatedMember] = useState({
    name: member.name || "",
    email: member.email || "",
    studentId: member.studentId || "",
    pictureURL: null,
    description: member.description || "",
    hobbies: member.hobbies || "",
    phoneNumber: member.phoneNumber || "",
    isActive: member.isActive || true,
    joinDate: member.joinDate || "",
  });

  const [uploading, setUploading] = useState(false);

  // Handle the file input change
  const handleFileChange = (e) => {
    setUpdatedMember({ ...updatedMember, pictureURL: e.target.files[0] });
  };

  const handleUpdateMember = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      // Check if a new picture is uploaded
      const pictureURL = updatedMember.pictureURL
        ? await uploadPicture(updatedMember.pictureURL)
        : member.pictureURL; // Keep the existing picture URL if no new picture is uploaded

      await updateMemberData(pictureURL);
    } catch (err) {
      console.error("Error updating member: ", err);
      
    }
  };

  const uploadPicture = async (file) => {
    const storageRef = ref(storage, `members/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true); // Show uploading state

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Monitor progress if needed
        },
        (error) => {
          console.error("Error during upload: ", error);
          setError(error.message);
          setUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL: ", downloadURL);
          setUploading(false);
          resolve(downloadURL); // Resolve with the download URL
        }
      );
    });
  };

  const updateMemberData = async (pictureURL) => {
    const response = await fetch(`http://localhost:4600/api/members/${member._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updatedMember,
        pictureURL, // Save the picture URL
        joinDate: updatedMember.joinDate || new Date().toISOString(), // Set join date if not provided
      }),
      credentials: "include", // Include credentials
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error response from server: ", errorData);
      throw new Error(errorData.message || "Failed to update member");
    }

    const data = await response.json();
    console.log("Member updated successfully: ", data);

    // Update the members state with the updated member
    setMembers((prevMembers) =>
      prevMembers.map((m) => (m._id === member._id ? data.member : m))
    );

    // Reset the input fields
    setUpdatedMember({
      name: "",
      email: "",
      studentId: "",
      pictureURL: null,
      description: "",
      hobbies: "",
      phoneNumber: "",
      isActive: true,
      joinDate: "",
    });
  };

  return (
    <form onSubmit={handleUpdateMember} className="mb-6 p-4 border rounded-lg shadow-md">
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Enter member name"
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
          placeholder="Enter member email"
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
          placeholder="Enter student ID"
          value={updatedMember.studentId}
          onChange={(e) => setUpdatedMember({ ...updatedMember, studentId: e.target.value })}
          required
          className={`w-full p-2 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        />
      </div>
      <div>
        <label htmlFor="pictureURL">Picture</label>
        <input
          type="file"
          onChange={handleFileChange}
          className={`w-full p-2 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          placeholder="Enter a brief description"
          value={updatedMember.description}
          onChange={(e) => setUpdatedMember({ ...updatedMember, description: e.target.value })}
          className={`w-full p-2 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        />
      </div>
      <div>
        <label htmlFor="hobbies">Hobbies</label>
        <input
          type="text"
          placeholder="Enter hobbies (comma-separated)"
          value={updatedMember.hobbies}
          onChange={(e) => setUpdatedMember({ ...updatedMember, hobbies: e.target.value })}
          className={`w-full p-2 border rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        />
      </div>
      <div>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          placeholder="Enter phone number"
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
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        {uploading ? "Updating..." : "Update Member"}
      </button>
    </form>
  );
};

export default UpdateMember;
