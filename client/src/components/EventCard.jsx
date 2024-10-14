import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; // Import icon for delete
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const EventCard = ({ event, darkMode, onDelete }) => {
  const navigate = useNavigate(); // For navigating to the event page
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is admin

  useEffect(() => {
    // Check if the user is an admin
    const token = Cookies.get("authtoken");

    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.role === "admin"); // Set isAdmin based on role
    }
  }, []);

  // Handle navigation to event details page
  const handleEventClick = () => {
    navigate(`/event/${event._id}`); // Redirect to event details page
  };

  // Handle event deletion (directly, without confirmation)
  const handleDeleteEvent = async (e) => {
    e.stopPropagation(); // Prevent card click
    try {
      const response = await fetch(`http://localhost:4600/api/events/${event._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        onDelete(event._id); // Notify parent component that event is deleted
      } else {
        const errorText = await response.text();
        console.error("Error deleting event:", errorText);
        alert("Failed to delete event. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div
      onClick={handleEventClick}
      className={`flex p-4 rounded-lg shadow-lg transition-all ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Event Poster */}
      {event.offlinePoster && (
        <img
          src={event.offlinePoster}
          alt={event.title}
          className="w-48 h-72 object-cover rounded-md mr-4"
          onClick={(e) => e.stopPropagation()} // Prevent card click on image click
        />
      )}

      {/* Event Information */}
      <div className="flex-1">
        {/* Event Title */}
        <h2 className="text-xl font-semibold mb-1">{event.title}</h2>

        {/* Event Date */}
        <div className="text-sm mb-1">
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
        </div>

        {/* Event Time */}
        {event.time && (
          <div className="text-sm mb-1">
            <strong>Time:</strong> {event.time}
          </div>
        )}

        {/* Event Location */}
        {event.location && (
          <div className="text-sm mb-2">
            <strong>Location:</strong> {event.location}
          </div>
        )}

        {/* Event Description */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          {event.description}
        </p>

        {/* Registration Link or Status */}
        <div className="mb-4">
          {event.isLive ? (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={(e) => e.stopPropagation()} // Prevent card click on link click
            >
              Register Here
            </a>
          ) : (
            <span className="text-red-500 font-semibold">
              Registration Closed
            </span>
          )}
        </div>

        {/* Live Status */}
        <div className="mt-2">
          {event.isLive ? (
            <span className="px-3 py-1 bg-green-500 text-white rounded-md">
              Live Now
            </span>
          ) : (
            <span className="px-3 py-1 bg-gray-500 text-white rounded-md">
              Not Live
            </span>
          )}
        </div>

        {/* Delete Event Icon (only shown for admins) */}
        {isAdmin && (
          <div className="mt-4 cursor-pointer" onClick={handleDeleteEvent}>
            <FaTrash size={20} className="text-red-500 hover:text-red-700" />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
