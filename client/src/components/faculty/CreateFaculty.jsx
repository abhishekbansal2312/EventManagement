import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase imports
import { storage } from "../../firebase"; // Import Firebase Storage
import { toast } from 'react-hot-toast'; // Import toast from react-hot-toast

const CreateFaculty = ({ setFaculty, onSave, onClose }) => {
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    facultyId: "",
    pictureURL: null, // Picture URL for uploaded picture
    specializations: "",
    description: "",
    phoneNumber: "",
    isActive: true,
    joinDate: "",
  });

  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [newPicture, setNewPicture] = useState(null); // Store uploaded picture

  // Drag and drop handlers for picture upload
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setNewPicture(file);
    setNewFaculty({ ...newFaculty, pictureURL: file });
    setDragging(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewPicture(file);
    setNewFaculty({ ...newFaculty, pictureURL: file });
  };

  // Input field change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaculty({ ...newFaculty, [name]: value });
  };

  const handleCheckboxChange = () => {
    setNewFaculty({ ...newFaculty, isActive: !newFaculty.isActive });
  };

  // Submit form handler
  const handleAddFaculty = async (e) => {
    e.preventDefault();

    if (!newPicture) {
      toast.error("Please upload a picture."); // Use toast for error
      return;
    }

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `faculty/${newPicture.name}`);
      const uploadTask = uploadBytesResumable(storageRef, newPicture);
      setUploading(true);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Error during upload: ", error);
          toast.error(error.message); // Use toast for error
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const response = await fetch("http://localhost:4600/api/faculty", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...newFaculty,
              pictureURL: downloadURL,
              specializations: newFaculty.specializations.split(","),
              joinDate: newFaculty.joinDate, // Use the selected join date
            }),
            credentials: "include",
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response from server: ", errorData);
            throw new Error(errorData.message || "Failed to add faculty");
          }

          const data = await response.json();
          setFaculty((prevFaculty) => [...prevFaculty, data.facultyConvener]);

          // Reset fields after submission
          setNewFaculty({
            name: "",
            email: "",
            facultyId: "",
            pictureURL: null,
            specializations: "",
            description: "",
            phoneNumber: "",
            isActive: true,
            joinDate: "", // Reset joinDate properly
          });
          setNewPicture(null);
          setUploading(false);
          toast.success("Faculty added successfully!"); // Success toast
          window.location.reload();
        }
      );
    } catch (err) {
      console.error("Error adding faculty: ", err);
      toast.error(err.message); // Use toast for error
      setUploading(false);
    }
  };

  return (
    <div className={`text-sm`}>
      <form
        onSubmit={handleAddFaculty}
        className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[14px]"
      >
        {/* Picture Upload Area */}
        <div
          className={`mb-2 border-2 border-dashed rounded-lg p-4 transition col-span-2 ${
            dragging ? "border-blue-500" : ""
          } dark:border-gray-300
              border-gray-600`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            className="flex items-center justify-center h-14"
            onClick={() => document.getElementById("fileInput").click()}
          >
            {newFaculty.pictureURL ? (
              <img
                src={URL.createObjectURL(newFaculty.pictureURL)}
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

        {/* Name Field */}
        <div className="mb-2">
          <label
            htmlFor="name"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newFaculty.name}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-2">
          <label
            htmlFor="email"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={newFaculty.email}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        {/* Faculty ID */}
        <div className="mb-2">
          <label
            htmlFor="facultyId"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Faculty ID
          </label>
          <input
            type="text"
            id="facultyId"
            name="facultyId"
            value={newFaculty.facultyId}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        {/* Specializations */}
        <div className="mb-2">
          <label
            htmlFor="specializations"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Specializations (comma-separated)
          </label>
          <input
            type="text"
            id="specializations"
            name="specializations"
            value={newFaculty.specializations}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Description */}
        <div className="mb-2 md:col-span-2">
          <label
            htmlFor="description"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newFaculty.description}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-28 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-2">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={newFaculty.phoneNumber}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Is Active Checkbox */}
        

        {/* Join Date Field */}
        <div className="mb-2">
          <label
            htmlFor="joinDate"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Join Date
          </label>
          <input
            type="date"
            id="joinDate"
            name="joinDate"
            value={newFaculty.joinDate}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newFaculty.isActive}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Active
          </label>
        </div>

        {/* Action Buttons */}
        <div className="mb-2 md:col-span-2 flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={uploading}
          >
            {uploading ? "Adding..." : "Add Faculty"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFaculty;
