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

  // Handle event deletion
  const handleDeleteEvent = async (e) => {
    e.stopPropagation(); // Prevent card click
    console.log("Delete button clicked for event:", event._id); // Debug log
    try {
      const response = await fetch(
        `http://localhost:4600/api/events/${event._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      console.log("Response Status:", response.status); // Debug log

      if (response.ok) {
        console.log("Event deleted successfully:", event._id); // Debug log
        onDelete(event._id); // Notify parent component that event is deleted
        alert("Event deleted successfully."); // Inform user about successful deletion
      } else {
        const errorText = await response.text();
        console.error("Error deleting event:", errorText);
        alert("Failed to delete event. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    }
  };

  return (
    <div
      onClick={handleEventClick}
      className={`flex shadow-md rounded-md ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } relative overflow-hidden`}
    >
      {/* Event Poster */}
      {event.offlinePoster && (
        <img
          src={event.offlinePoster}
          alt={event.title}
          className="w-48 h-72 object-cover"
          onClick={(e) => e.stopPropagation()} // Prevent card click on image click
        />
      )}

      {/* Event Information */}
      <div className="flex-1 flex flex-col justify-between p-2">
        <div>
          {/* Event Title */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-gray-700 font-semibold transition duration-300">
              {event.title}
            </h2>
            {event.isLive ? (
              <span className="text-green-500 rounded-md text-[12px] font-bold">
                Live Now
              </span>
            ) : (
              <span className="text-gray-500 rounded-md text-[12px] font-bold">
                Not Live
              </span>
            )}
          </div>

          <div className="text-[12px] mt-2">
            {/* Event Date */}
            <div className=" mb-1">
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </div>

            {/* Event Time */}
            {event.time && (
              <div className=" mb-1">
                <strong>Time:</strong> {event.time}
              </div>
            )}

            {/* Event Location */}
            {event.location && (
              <div className=" mb-2">
                <strong>Location:</strong> {event.location}
              </div>
            )}
            <hr />
            {/* Event Description */}
            <div className="mt-2">
              <strong className="text-gray-700">Description</strong>
              <p className=" text-gray-500 dark:text-gray-300 mb-4">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {/* Registration Link or Status */}
        <div className="flex justify-between items-center">
          {event.isLive ? (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-normal text-[12px]"
              onClick={(e) => e.stopPropagation()} // Prevent card click on link click
            >
              Register Here
            </a>
          ) : (
            <span className="text-red-500 font-normal text-[12px]">
              Registrations Closed
            </span>
          )}
          {/* Delete Event Icon (only shown for admins) */}
          {isAdmin && (
            <div className="cursor-pointer" onClick={handleDeleteEvent}>
              <FaTrash size={12} className="text-red-500 hover:text-red-700 " />
            </div>
          )}
          {/* Live Status */}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
