import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditEventPage = ({ darkMode }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const eventDate = data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "";

        setFormData({
          ...data,
          date: eventDate,
        });
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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

    try {
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
      window.location.href = `/event/${id}`;
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "text-gray-900"
      } py-10`}
    >
      <ToastContainer />
      <div className="container mx-auto p-8 px-16 bg-white dark:bg-gray-800 shadow-lg rounded-lg text-[14px]">
        <h1 className="text-4xl font-bold mb-8">Edit Event</h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
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
            <label className="block text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Event Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Event Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Event Link
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300">
              Online Poster
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setOnlinePosterFile(e.target.files[0])}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mt-1 dark:bg-gray-800 cursor-pointer"
            />
            {formData.onlinePoster && (
              <img
                src={formData.onlinePoster}
                alt="Online Poster"
                className="w-32 h-32 mt-2 object-cover rounded"
              />
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300">
              Offline Poster
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setOfflinePosterFile(e.target.files[0])}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mt-1 dark:bg-gray-800 cursor-pointer"
            />
            {formData.offlinePoster && (
              <img
                src={formData.offlinePoster}
                alt="Offline Poster"
                className="w-32 h-32 mt-2 object-cover rounded"
              />
            )}
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center">
            <input
              type="checkbox"
              name="isLive"
              checked={formData.isLive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700 dark:text-gray-300">
              Make this event live
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-[12px] text-white font-normal py-2 px-4 rounded-md transition-colors duration-300 col-span-1 md:col-span-2"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
