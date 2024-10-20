import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import storage functions
import { storage } from "../firebase"; // Import Firebase Storage

const EditFaculty = ({ faculty, onSave, onCancel, darkMode, setError }) => {
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
    pictureURL: faculty.pictureURL || "",
  });

  const [newPicture, setNewPicture] = useState(null); // State to hold the new picture file
  const [uploading, setUploading] = useState(false); // To show uploading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isActive: e.target.checked });
  };

  const handleSpecializationsChange = (e) => {
    const specializations = e.target.value;
    setFormData({ ...formData, specializations });
  };

  // Handle file input for new picture
  const handlePictureChange = (e) => {
    setNewPicture(e.target.files[0]); // Set the new picture file
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let pictureURL = formData.pictureURL;

    if (newPicture) {
      try {
        const storageRef = ref(storage, `faculty/${newPicture.name}`);
        const uploadTask = uploadBytesResumable(storageRef, newPicture);
        await uploadTask;
        pictureURL = await getDownloadURL(uploadTask.snapshot.ref);
      } catch (error) {
        console.error("Error uploading picture: ", error);
        setError(error.message);
        setUploading(false);
        return;
      }
    }

    const updatedFacultyData = { ...formData, pictureURL };
    onSave(updatedFacultyData);
    setUploading(false);
  };

  return (
    <div className={`text-sm`}>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[14px]"
      >
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

        {/* Picture Upload Input */}
        <div className="mb-2 md:col-span-2">
          <label
            htmlFor="picture"
            className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
          >
            Upload Picture
          </label>
          <input
            type="file"
            onChange={handlePictureChange}
            className="flex items-center justify-center w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer transition duration-200 dark:bg-gray-800"
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
