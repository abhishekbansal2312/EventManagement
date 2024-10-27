import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; // Import icon for delete
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import Register from "../../pages/Register";
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast

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
        `https://eventmanagement-b7vf.onrender.com/api/events/${event._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      console.log("Response Status:", response.status); // Debug log

      if (response.ok) {
        console.log("Event deleted successfully:", event._id); // Debug log
        onDelete(event._id); // Notify parent component that event is deleted
        toast.success("Event deleted successfully."); // Inform user about successful deletion
      } else {
        const errorText = await response.text();
        console.error("Error deleting event:", errorText);
        toast.error("Failed to delete event. Please try again."); // Updated to use toast
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("An error occurred while deleting the event."); // Updated to use toast
    }
  };

  return (
    <div
      onClick={handleEventClick}
      className={`max-h-64 flex shadow-md rounded-md ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } relative overflow-hidden`}
    >
      {/* Event Poster */}
      {event.offlinePoster && (
        <img
          src={event.offlinePoster}
          alt={event.title}
          className="w-38 h-72 object-cover max-h-64"
          onClick={(e) => e.stopPropagation()} // Prevent card click on image click
        />
      )}

      {/* Event Information */}
      <div className="flex-1 flex flex-col justify-between p-2">
        <div>
          {/* Event Title */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-gray-700 dark:text-gray-400 font-semibold">
              {event.title}
            </h2>
            {event.isLive ? (
              <span className="text-green-500 rounded-md text-[10px] font-bold">
                Live Now
              </span>
            ) : (
              <span className="text-gray-500 rounded-md text-[10px] font-bold">
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
              <strong className="text-gray-700 dark:text-gray-400">
                Description
              </strong>
              <p className=" text-gray-500 dark:text-gray-300 mb-4">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {event.isLive ? (
            <Link
              to={`/event/${event._id}/register`} // Use the correct ID property
              state={{ link: event.link }} // Pass event.link using state
              className="text-blue-600 dark:text-blue-400 font-normal text-[12px]"
              onClick={(e) => e.stopPropagation()} // Prevent card click on link click
            >
              Register Here
            </Link>
          ) : (
            <span className="text-yellow-800 dark:text-yellow-400 font-normal text-[12px]">
              Registrations Closed
            </span>
          )}
          {/* Delete Event Icon (only shown for admins) */}
          {isAdmin && (
            <div className="cursor-pointer" onClick={handleDeleteEvent}>
              <FaTrash
                size={12}
                className="text-red-500 dark:text-red-700 hover:text-red-700 "
              />
            </div>
          )}
          {/* Live Status */}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
