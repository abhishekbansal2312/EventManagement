import React, { useState } from "react";
// Removed ToastContainer import since it's not used
import { toast } from "react-hot-toast"; // Import from react-hot-toast
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreateEventPage = ({ darkMode, setEvents }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    link: "",
    onlinePoster: "",
    offlinePoster: "",
    isLive: false,
  });
  const [onlinePosterFile, setOnlinePosterFile] = useState(null);
  const [offlinePosterFile, setOfflinePosterFile] = useState(null);
  const [draggingOnline, setDraggingOnline] = useState(false);
  const [draggingOffline, setDraggingOffline] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      let onlinePosterUrl = formData.onlinePoster;
      let offlinePosterUrl = formData.offlinePoster;

      if (onlinePosterFile) {
        onlinePosterUrl = await uploadImage(onlinePosterFile);
      }

      if (offlinePosterFile) {
        offlinePosterUrl = await uploadImage(offlinePosterFile);
      }

      const newEvent = {
        ...formData,
        onlinePoster: onlinePosterUrl,
        offlinePoster: offlinePosterUrl,
      };

      const response = await fetch(
        `https://eventmanagement-b7vf.onrender.com/api/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newEvent),
        }
      );

      if (!response.ok) throw new Error("Error creating event");

      toast.success("Event created successfully!"); // Success toast
      setLoading(false); // Stop loading
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        link: "",
        onlinePoster: "",
        offlinePoster: "",
        isLive: false,
      }); // Reset form

      // Optionally redirect
      setEvents(newEvent);
      window.location.href = `/events`;
    } catch (error) {
      toast.error("Error creating event"); // Error toast, simplified message
      setLoading(false); // Stop loading in case of error
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingOnline(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingOnline(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingOnline(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setOnlinePosterFile(file);
      setFormData((prev) => ({
        ...prev,
        onlinePoster: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Only image files are allowed for the online poster.");
    }
  };

  const handleDragOverOffline = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingOffline(true);
  };

  const handleDragLeaveOffline = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingOffline(false);
  };

  const handleDropOffline = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingOffline(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setOfflinePosterFile(file);
      setFormData((prev) => ({
        ...prev,
        offlinePoster: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Only image files are allowed for the offline poster.");
    }
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? " text-white" : "text-gray-900"}`}
    >
      <div className="text-sm">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[14px]"
        >
          <div className="mb-2">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 h-32 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Event Link
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Online Poster Upload */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Online Poster
            </label>
            <div
              className={`border-2 border-dashed ${
                draggingOnline ? "border-blue-500" : "border-gray-300"
              } rounded-lg p-4 text-center relative`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p className="mb-2">Drag & Drop Online Poster Here</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setOnlinePosterFile(file);
                    setFormData((prev) => ({
                      ...prev,
                      onlinePoster: URL.createObjectURL(file),
                    }));
                  }
                }}
                className="hidden"
                id="online-poster-upload"
              />
              <label
                htmlFor="online-poster-upload"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Upload Online Poster
              </label>
              {formData.onlinePoster && (
                <div className="mt-2">
                  <img
                    src={formData.onlinePoster}
                    alt="Online Poster Preview"
                    className="h-32 w-auto object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Offline Poster Upload */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Offline Poster
            </label>
            <div
              className={`border-2 border-dashed ${
                draggingOffline ? "border-blue-500" : "border-gray-300"
              } rounded-lg p-4 text-center relative`}
              onDragOver={handleDragOverOffline}
              onDragLeave={handleDragLeaveOffline}
              onDrop={handleDropOffline}
            >
              <p className="mb-2">Drag & Drop Offline Poster Here</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setOfflinePosterFile(file);
                    setFormData((prev) => ({
                      ...prev,
                      offlinePoster: URL.createObjectURL(file),
                    }));
                  }
                }}
                className="hidden"
                id="offline-poster-upload"
              />
              <label
                htmlFor="offline-poster-upload"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Upload Offline Poster
              </label>
              {formData.offlinePoster && (
                <div className="mt-2">
                  <img
                    src={formData.offlinePoster}
                    alt="Offline Poster Preview"
                    className="h-32 w-auto object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="isLive"
              checked={formData.isLive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700 dark:text-gray-300">Is Live</label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-10 bg-blue-500 text-white rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
