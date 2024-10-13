import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdUpload, MdDelete } from "react-icons/md";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [onlinePosterFile, setOnlinePosterFile] = useState(null);
  const [offlinePosterFile, setOfflinePosterFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const onlinePosterInputRef = useRef(null); // Create a ref for online poster input
  const offlinePosterInputRef = useRef(null); // Create a ref for offline poster input

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0]; // Allow only one file
    if (file && validateFile(file)) {
      setFile(file);
    } else {
      setErrorMessage(
        "Invalid file type or size. Please select a valid image (JPEG, PNG, GIF) under 5MB."
      );
    }
  };

  const removeFile = (setFile, inputRef) => {
    setFile(null);
    inputRef.current.value = ""; // Reset the input value to trigger onChange next time
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let onlinePosterUrl = null;
      let offlinePosterUrl = null;

      if (onlinePosterFile) {
        const onlinePosterRef = ref(
          storage,
          `posters/online/${onlinePosterFile.name}`
        );
        await uploadBytes(onlinePosterRef, onlinePosterFile);
        onlinePosterUrl = await getDownloadURL(onlinePosterRef);
      }

      if (offlinePosterFile) {
        const offlinePosterRef = ref(
          storage,
          `posters/offline/${offlinePosterFile.name}`
        );
        await uploadBytes(offlinePosterRef, offlinePosterFile);
        offlinePosterUrl = await getDownloadURL(offlinePosterRef);
      }

      const eventData = {
        title,
        description,
        date,
        time,
        location,
        link,
        onlinePoster: onlinePosterUrl ? [onlinePosterUrl] : [],
        offlinePoster: offlinePosterUrl ? [offlinePosterUrl] : [],
      };

      const response = await fetch("http://localhost:4600/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setErrorMessage(null);

      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      setLink("");
      setOnlinePosterFile(null);
      setOfflinePosterFile(null);

      navigate("/events");
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg text-[14px]">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Create a New Event
      </h1>

      {successMessage && (
        <p className="bg-green-100 text-green-700 p-4 rounded mb-4 text-center">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center">
          {errorMessage}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
      >
        <div>
          <label htmlFor="eventTitle" className="block text-gray-700">
            Event Title
          </label>
          <input
            id="eventTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="eventDate" className="block text-gray-700">
            Date
          </label>
          <input
            id="eventDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="eventTime" className="block text-gray-700 ">
            Time
          </label>
          <input
            id="eventTime"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="eventLocation" className="block text-gray-700 ">
            Location
          </label>
          <input
            id="eventLocation"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="">
          <label htmlFor="eventDescription" className="block text-gray-700 ">
            Description
          </label>
          <textarea
            id="eventDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 h-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            rows="5"
          />
        </div>
        <div>
          <label htmlFor="eventLink" className="block text-gray-700 ">
            Link (Optional)
          </label>
          <input
            id="eventLink"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full mt-1 p-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="">
          <label className="block text-gray-700 mb-2">
            Upload Online Poster
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setOnlinePosterFile)}
            className="hidden"
            id="eventOnlinePoster"
            ref={onlinePosterInputRef} // Assign ref here
          />
          <label
            htmlFor="eventOnlinePoster"
            className="flex items-center justify-center w-full h-12 border border-gray-300 rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100 transition duration-200"
          >
            <MdUpload className="mr-2" /> Select Online Poster
          </label>
          <div className="mt-2">
            {onlinePosterFile && (
              <div className="flex justify-between items-center">
                {onlinePosterFile.name}
                <button
                  type="button"
                  onClick={() =>
                    removeFile(setOnlinePosterFile, onlinePosterInputRef)
                  }
                  className="text-red-500 hover:underline ml-2"
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Offline Poster Upload Section */}
        <div className="">
          <label className="block text-gray-700 mb-2">
            Upload Offline Poster
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setOfflinePosterFile)}
            className="hidden"
            id="eventOfflinePoster"
            ref={offlinePosterInputRef} // Assign ref here
          />
          <label
            htmlFor="eventOfflinePoster"
            className="flex items-center justify-center w-full h-12 border border-gray-300 rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100 transition duration-200"
          >
            <MdUpload className="mr-2" /> Select Offline Poster
          </label>
          <div className="mt-2">
            {offlinePosterFile && (
              <div className="flex justify-between items-center">
                {offlinePosterFile.name}
                <button
                  type="button"
                  onClick={() =>
                    removeFile(setOfflinePosterFile, offlinePosterInputRef)
                  }
                  className="text-red-500 hover:underline ml-2"
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className={`w-full h-12 bg-blue-600 text-white rounded-lg transition duration-300 hover:bg-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
