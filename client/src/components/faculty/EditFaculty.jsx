import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import storage functions
import { storage } from "../../firebase"; // Import Firebase Storage

const EditFaculty = ({ faculty, onSave, onCancel, setErrorMessage }) => {
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
        setErrorMessage(error.message);
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


        {/* Is Active Toggle Switch */}
        <div className="mb-2">
          <label
            htmlFor="isActive"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-3"
          >
            Is Active
          </label>
          <div
            className="relative inline-block w-10 h-6"
            onClick={(e) => handleCheckboxChange(e)}
          >
            {/* Background of the toggle */}
            <div
              className={`w-10 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                formData.isActive
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            ></div>

            {/* Toggle handle */}
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                formData.isActive ? "translate-x-4" : ""
              }`}
            ></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4 col-span-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-normal py-2 px-4 rounded-md transition-colors duration-300 text-[12px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-md transition-colors duration-300 text-[12px]"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFaculty;
