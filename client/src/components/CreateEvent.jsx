import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from '../firebase'; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let onlinePosterUrl = null;
      let offlinePosterUrl = null;

      if (onlinePosterFile) {
        const onlinePosterRef = ref(storage, `posters/online/${onlinePosterFile.name}`);
        await uploadBytes(onlinePosterRef, onlinePosterFile);
        onlinePosterUrl = await getDownloadURL(onlinePosterRef);
      }

      if (offlinePosterFile) {
        const offlinePosterRef = ref(storage, `posters/offline/${offlinePosterFile.name}`);
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
        onlinePoster: onlinePosterUrl,
        offlinePoster: offlinePosterUrl,
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Create a New Event</h1>

      {successMessage && (
        <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{successMessage}</p>
      )}

      {errorMessage && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="eventTitle" className="block text-gray-700">Event Title</label>
          <input
            id="eventTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="eventDate" className="block text-gray-700">Date</label>
          <input
            id="eventDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="eventDescription" className="block text-gray-700">Description</label>
          <textarea
            id="eventDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="eventTime" className="block text-gray-700">Time</label>
          <input
            id="eventTime"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="eventLocation" className="block text-gray-700">Location</label>
          <input
            id="eventLocation"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="eventLink" className="block text-gray-700">Link (Optional)</label>
          <input
            id="eventLink"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="eventOnlinePoster" className="block text-gray-700">Upload Online Poster</label>
          <input
            id="eventOnlinePoster"
            type="file"
            accept="image/*"
            onChange={(e) => setOnlinePosterFile(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="eventOfflinePoster" className="block text-gray-700">Upload Offline Poster</label>
          <input
            id="eventOfflinePoster"
            type="file"
            accept="image/*"
            onChange={(e) => setOfflinePosterFile(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className={`w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
