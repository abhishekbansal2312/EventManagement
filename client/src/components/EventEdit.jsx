import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from '../firebase'; // Import firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage functions

const EditEventPage = ({ darkMode }) => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    link: '',
    onlinePoster: '',
    offlinePoster: '',
    isLive: false, // Add isLive property to the form data
  });
  const [onlinePosterFile, setOnlinePosterFile] = useState(null);
  const [offlinePosterFile, setOfflinePosterFile] = useState(null);

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:4600/api/events/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Event not found");

        const data = await response.json();
        setEvent(data);
        setFormData({ ...data, isLive: data.isLive }); // Ensure isLive is set correctly
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Upload image to Firebase and get the URL
  const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Handle file uploads
      let onlinePosterUrl = formData.onlinePoster;
      let offlinePosterUrl = formData.offlinePoster;

      if (onlinePosterFile) {
        onlinePosterUrl = await uploadImage(onlinePosterFile);
      }

      if (offlinePosterFile) {
        offlinePosterUrl = await uploadImage(offlinePosterFile);
      }

      const updatedEvent = {
        ...formData,
        onlinePoster: onlinePosterUrl,
        offlinePoster: offlinePosterUrl,
      };

      const response = await fetch(`http://localhost:4600/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) throw new Error("Error updating event");

      toast.success("Event updated successfully!");
      // Redirect to the event page after a successful update
      window.location.href = `/event/${id}`;
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "text-gray-900"} py-10`}>
      <ToastContainer />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Edit Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="block w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event Description"
            className="block w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="block w-full p-2 border rounded"
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="block w-full p-2 border rounded"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event Location"
            className="block w-full p-2 border rounded"
          />
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Event Link"
            className="block w-full p-2 border rounded"
          />

          {/* Upload Online Poster */}
          <input
            type="file"
            onChange={(e) => setOnlinePosterFile(e.target.files[0])}
            className="block w-full p-2 border rounded"
          />
          {formData.onlinePoster && <img src={formData.onlinePoster} alt="Online Poster" className="w-32 h-32" />}

          {/* Upload Offline Poster */}
          <input
            type="file"
            onChange={(e) => setOfflinePosterFile(e.target.files[0])}
            className="block w-full p-2 border rounded"
          />
          {formData.offlinePoster && <img src={formData.offlinePoster} alt="Offline Poster" className="w-32 h-32" />}

          {/* Checkbox for isLive */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isLive"
              checked={formData.isLive}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isLive">Is Live</label>
          </div>

          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
