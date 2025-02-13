import React, { useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify"; // You can remove this if you're not using it elsewhere
import { toast } from "react-hot-toast"; // Updated import
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useAxios from "../../utils/useAxios";

const EditEventPage = ({ darkMode, event, setEvent, onClose }) => {
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
  const makeRequest = useAxios();

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

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
    setLoading(true);

    try {
      if (!event || !event._id) {
        throw new Error("Event ID is missing. Cannot update the event.");
      }

      let onlinePosterUrl = formData.onlinePoster;
      let offlinePosterUrl = formData.offlinePoster;

      // Upload new images if provided
      if (onlinePosterFile)
        onlinePosterUrl = await uploadImage(onlinePosterFile);
      if (offlinePosterFile)
        offlinePosterUrl = await uploadImage(offlinePosterFile);

      const updatedEvent = {
        ...formData,
        onlinePoster: onlinePosterUrl,
        offlinePoster: offlinePosterUrl,
      };

      // Using useAxios for cleaner API calls
      await makeRequest(
        `http://localhost:4600/api/events/${event._id}`,
        "PUT",
        updatedEvent,
        true
      );

      toast.success("Event updated successfully!");
      setEvent((prevEvent) => ({ ...prevEvent, ...updatedEvent })); // Dynamically update event state

      // Reset form after update
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
      });

      onClose(); // Close modal if applicable
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating event");
    } finally {
      setLoading(false);
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
      // Check if file is an image
      setOnlinePosterFile(file);
      setFormData((prev) => ({
        ...prev,
        onlinePoster: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Only image files are allowed for the online poster."); // Kept for error handling
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
      // Check if file is an image
      setOfflinePosterFile(file);
      setFormData((prev) => ({
        ...prev,
        offlinePoster: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Only image files are allowed for the offline poster."); // Kept for error handling
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
              } rounded-lg p-4 text-center`}
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
              />
              {formData.onlinePoster && (
                <img
                  src={formData.onlinePoster}
                  alt="Online Poster"
                  className="mx-auto h-32"
                />
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
              } rounded-lg p-4 text-center`}
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
              />
              {formData.offlinePoster && (
                <img
                  src={formData.offlinePoster}
                  alt="Offline Poster"
                  className="mx-auto h-32"
                />
              )}
            </div>
          </div>

          <div className="flex items-center">
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
              className={`w-full py-2 mt-4 font-bold text-white rounded-lg ${
                loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
