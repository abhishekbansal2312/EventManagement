import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase storage functions
import { storage } from "../../firebase"; // Firebase configuration
import { toast } from "react-hot-toast"; // Importing toast

const CreateMember = ({ setMembers, darkMode, onSave, onCancel }) => {
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    studentId: "",
    pictureURL: null,
    description: "",
    hobbies: "",
    phoneNumber: "",
    isActive: true, // Active status
    joinDate: "", // Join date
  });

  const [uploading, setUploading] = useState(false); // Uploading state
  const [dragging, setDragging] = useState(false); // Drag state
  const [uploadError, setUploadError] = useState(""); // Error state

  const handleAddMember = async (event) => {
    event.preventDefault();

    if (!newMember.pictureURL) {
      toast.error("Please upload a picture."); // Using toast for error
      return;
    }

    try {
      const storageRef = ref(storage, `members/${newMember.pictureURL.name}`);
      const uploadTask = uploadBytesResumable(storageRef, newMember.pictureURL);
      setUploading(true);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Upload error: ", error);
          setUploadError(error.message);
          setUploading(false);
          toast.error(error.message); // Using toast for upload error
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const response = await fetch("http://localhost:4600/api/members", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...newMember,
              pictureURL: downloadURL,
              joinDate: newMember.joinDate || new Date().toISOString(),
            }),
            credentials: "include",
          });

          if (!response.ok) {
            const errorData = await response.json();
            setUploadError(errorData.message || "Failed to add member");
            setUploading(false);
            toast.error(errorData.message || "Failed to add member"); // Using toast for API error
            return;
          }

          const data = await response.json();
          setMembers((prevMembers) => [...prevMembers, data.member]);

          if (onSave) onSave(data.member);
          setNewMember({
            name: "",
            email: "",
            studentId: "",
            pictureURL: null,
            description: "",
            hobbies: "",
            phoneNumber: "",
            isActive: true,
            joinDate: "", // Reset joinDate
          });

          setUploading(false);
          toast.success("Member added successfully!"); // Success toast
        }
      );
    } catch (err) {
      setUploadError(err.message);
      setUploading(false);
      toast.error(err.message); // Using toast for catch error
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setNewMember((prev) => ({ ...prev, pictureURL: file }));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleToggleActive = () => {
    setNewMember((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  return (
    <div className="text-sm">
      <form
        onSubmit={handleAddMember}
        className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[14px]"
      >
        {/* Left Column */}
        <div
          className={`mb-2 border-2 border-dashed rounded-lg p-4 transition col-span-2 ${
            dragging ? "border-blue-500" : ""
          } dark:border-gray-300 border-gray-600`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              setNewMember({ ...newMember, pictureURL: e.target.files[0] })
            }
          />
          <div
            className="flex items-center justify-center h-14"
            onClick={() => document.getElementById("fileInput").click()}
          >
            {newMember.pictureURL ? (
              <img
                src={URL.createObjectURL(newMember.pictureURL)}
                alt="Faculty"
                className="h-full"
              />
            ) : (
              <p className="text-gray-400 dark:text-gray-300">
                Drag and drop a file here, or click to select a file
              </p>
            )}
          </div>
        </div>
        <div className="mb-2">
          <label
            htmlFor="name"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Name
          </label>
          <input
            type="text"
            placeholder="Enter member name"
            value={newMember.name}
            onChange={(e) =>
              setNewMember({ ...newMember, name: e.target.value })
            }
            required
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="email"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Enter member email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            required
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="studentId"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Student ID
          </label>
          <input
            type="text"
            placeholder="Enter student ID"
            value={newMember.studentId}
            onChange={(e) =>
              setNewMember({ ...newMember, studentId: e.target.value })
            }
            required
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Phone Number
          </label>
          <input
            type="text"
            placeholder="Enter phone number"
            value={newMember.phoneNumber}
            onChange={(e) =>
              setNewMember({ ...newMember, phoneNumber: e.target.value })
            }
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mb-2 md:col-span-2">
          <label
            htmlFor="description"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Description
          </label>
          <textarea
            placeholder="Enter a brief description"
            value={newMember.description}
            onChange={(e) =>
              setNewMember({ ...newMember, description: e.target.value })
            }
            className="w-full mt-1 p-2 h-28 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Right Column */}
        <div className="mb-2">
          <label
            htmlFor="hobbies"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Hobbies
          </label>
          <input
            type="text"
            placeholder="Enter hobbies (comma-separated)"
            value={newMember.hobbies}
            onChange={(e) =>
              setNewMember({ ...newMember, hobbies: e.target.value })
            }
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mb-2 md:col-span-2 flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={newMember.isActive}
            onChange={handleToggleActive}
            className="mr-2 h-5 w-5"
          />
          <label
            htmlFor="isActive"
            className="text-gray-700 dark:text-gray-300 font-semibold"
          >
            Active Member
          </label>
        </div>

        <div className="mb-2 md:col-span-2 flex justify-between">
          <button
            type="submit"
            className={`p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Add Member"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
      {uploadError && <p className="text-red-500">{uploadError}</p>}{" "}
      {/* Display upload errors */}
    </div>
  );
};

export default CreateMember;
