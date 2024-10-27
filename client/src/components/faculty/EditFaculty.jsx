import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import storage functions
import { storage } from "../../firebase"; // Import Firebase Storage
import { toast } from 'react-hot-toast'; // Import toast

const EditFaculty = ({ faculty, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    _id: faculty._id || "",
    name: faculty.name || "",
    email: faculty.email || "",
    facultyId: faculty.facultyId || "",
    specializations: faculty.specializations || "",
    description: faculty.description || "",
    phoneNumber: faculty.phoneNumber || "",
    isActive: faculty.isActive || false,
    joinDate: faculty.joinDate || "",
    pictureURL: null,
  });

  const [newPicture, setNewPicture] = useState(null); // State to hold the new picture file
  const [uploading, setUploading] = useState(false); // To show uploading state
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setNewPicture(file);
    if (file) {
      setFormData({ ...formData, pictureURL: file });
    }
  };

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
    if (file) {
      setFormData({ ...formData, pictureURL: file });
    }
    setDragging(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  const handleSpecializationsChange = (e) => {
    const specializations = e.target.value;
    setFormData({ ...formData, specializations });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let pictureURL;

    if (newPicture) {
      try {
        const storageRef = ref(storage, `faculty/${newPicture.name}`);
        const uploadTask = uploadBytesResumable(storageRef, newPicture);
        await uploadTask;
        pictureURL = await getDownloadURL(uploadTask.snapshot.ref);
      } catch (error) {
        console.error("Error uploading picture: ", error);
        toast.error(error.message); // Show error toast
        setUploading(false);
        return;
      }
    }

    const updatedFacultyData = { ...formData, pictureURL };
    onSave(updatedFacultyData);
    setUploading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return empty if dateString is not provided
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
  };
  
  return (
    <div className={`text-sm`}>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[14px]"
      >
        <div
          className={`mb-2 border-2 border-dashed rounded-lg p-4 transition col-span-2 ${
            dragging ? "border-blue-500" : ""
          } dark:border-gray-300
              border-gray-600`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center justify-center h-14">
            {formData.pictureURL ? (
              <p>{formData.pictureURL.name}</p>
            ) : (
              <p className="text-gray-400">
                Drag and drop a file here, or click to select a file
              </p>
            )}
          </div>
        </div>
        {/* Name Input */}
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
            value={formData.name}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        {/* Email Input */}
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
            value={formData.email}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        {/* Faculty ID Input */}
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
            value={formData.facultyId}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        {/* Specializations Input */}
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
            value={formData.specializations}
            onChange={handleSpecializationsChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Description Input */}
        <div className="mb-2 md:col-span-2">
          <label
            htmlFor="description"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Bio / Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-28 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Phone Number Input */}
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
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="joinDate"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Join Date
          </label>
          <input
            type="date" // assuming joinDate is a date field
            id="joinDate"
            name="joinDate"
            value={formData.joinDate || formatDate(faculty.joinDate)} // Format the date
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mb-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={handleCheckboxChange}
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2">Is Active</span>
          </label>
        </div>

        <div className="flex justify-between md:col-span-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={uploading} // Disable button during upload
          >
            {uploading ? "Uploading..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFaculty;
