import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import storage functions
import { storage } from "../firebase"; // Import Firebase Storage

const EditFaculty = ({ faculty, onSave, onCancel, darkMode, setError }) => {
  // Initialize the form state with the current faculty data
  const [formData, setFormData] = useState({
    _id: faculty._id || "", // Add _id here
    name: faculty.name || "",
    email: faculty.email || "",
    facultyId: faculty.facultyId || "",
    specializations: faculty.specializations || [],
    description: faculty.description || "",
    phoneNumber: faculty.phoneNumber || "",
    isActive: faculty.isActive || false,
    joinDate: faculty.joinDate || "",
    pictureURL: faculty.pictureURL || "",
  });

  const [newPicture, setNewPicture] = useState(null); // State to hold the new picture file
  const [uploading, setUploading] = useState(false); // To show uploading state

  // Handle input changes for each field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox changes (for isActive)
  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isActive: e.target.checked });
  };

  // Handle specializations input (comma-separated values)
  const handleSpecializationsChange = (e) => {
    const specializations = e.target.value
      .split(",")
      .map((spec) => spec.trim());
    setFormData({ ...formData, specializations });
  };

  // Handle file input for new picture
  const handlePictureChange = (e) => {
    setNewPicture(e.target.files[0]); // Set the new picture file
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true); // Show uploading state

    let pictureURL = formData.pictureURL; // Keep the existing picture URL

    // If a new picture is uploaded, upload it to Firebase
    if (newPicture) {
      try {
        const storageRef = ref(storage, `faculty/${newPicture.name}`); // Create storage reference
        const uploadTask = uploadBytesResumable(storageRef, newPicture); // Upload the file

        await uploadTask; // Wait for the upload to complete
        pictureURL = await getDownloadURL(uploadTask.snapshot.ref); // Get the new picture URL
      } catch (error) {
        console.error("Error uploading picture: ", error); // Log upload error
        setError(error.message);
        setUploading(false);
        return; // Stop submission if there was an error
      }
    }

    // Create updated form data including picture URL
    const updatedFacultyData = {
      ...formData,
      pictureURL, // Use the new picture URL (or the existing one if not uploaded)
    };

    onSave(updatedFacultyData); // Pass the updated form data to the parent component
    setUploading(false); // Hide uploading state
  };

  return (
    <div
      className={`max-w-3xl mx-auto ${
        darkMode ? "bg-gray-800 text-white " : "bg-white text-gray-900"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[14px]"
      >
        {/* Name Input */}
        <div className="mb-2">
          <label htmlFor="name" className="block font-semibold mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-2">
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Faculty ID Input */}
        <div className="mb-2">
          <label htmlFor="facultyId" className="block font-semibold mb-1">
            Faculty ID
          </label>
          <input
            type="text"
            id="facultyId"
            name="facultyId"
            value={formData.facultyId}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Specializations Input */}
        <div className="mb-2">
          <label htmlFor="specializations" className="block font-semibold mb-1">
            Specializations (comma-separated)
          </label>
          <input
            type="text"
            id="specializations"
            name="specializations"
            value={formData.specializations.join(", ")}
            onChange={handleSpecializationsChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Description Input */}
        <div className="mb-2 md:col-span-2">
          <label htmlFor="description" className="block font-semibold mb-1">
            Bio / Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Phone Number Input */}
        <div className="mb-2">
          <label htmlFor="phoneNumber" className="block font-semibold mb-1">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Picture Upload Input */}
        <div className="mb-2 md:col-span-2">
          <label htmlFor="picture" className="block font-semibold mb-1">
            Upload Picture
          </label>
          <input
            type="file"
            onChange={handlePictureChange}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Is Active Checkbox */}
        <div className="mb-2">
          <label htmlFor="isActive" className="inline-flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Is Active
          </label>
        </div>

        {/* Button Container for Save and Cancel */}
        <div className="flex justify-end gap-2 mt-4">
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
