import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAxios from "../../utils/useAxios";

const EventCard = ({ event, darkMode, onDelete }) => {
  const navigate = useNavigate();

  const makeRequest = useAxios();

  const handleEventClick = () => {
    navigate(`/event/${event._id}`);
  };

  const handleDeleteEvent = async (e) => {
    e.stopPropagation();
    try {
      await makeRequest(
        `http://localhost:4600/api/events/${event._id}`,
        "DELETE",
        null,
        true
      );
      onDelete(event._id);
      toast.success("Event deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete event. Please try again.");
    }
  };

  return (
    <div
      onClick={handleEventClick}
      className={`max-h-64 flex shadow-md rounded-md ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } relative overflow-hidden`}
    >
      {event.offlinePoster && (
        <img
          src={event.offlinePoster}
          alt={event.title}
          className="w-38 h-72 object-cover max-h-64"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <div className="flex-1 flex flex-col justify-between p-2">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-gray-700 dark:text-gray-400 font-semibold">
              {event.title}
            </h2>
            <span
              className={`${
                event.isLive ? "text-green-500" : "text-gray-500"
              } rounded-md text-[10px] font-bold`}
            >
              {event.isLive ? "Live Now" : "Not Live"}
            </span>
          </div>

          <div className="text-[12px] mt-2">
            <div className="mb-1">
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </div>
            {event.time && (
              <div className="mb-1">
                <strong>Time:</strong> {event.time}
              </div>
            )}
            {event.location && (
              <div className="mb-2">
                <strong>Location:</strong> {event.location}
              </div>
            )}
            <hr />
            <div className="mt-2">
              <strong className="text-gray-700 dark:text-gray-400">
                Description
              </strong>
              <p className="text-gray-500 dark:text-gray-300 mb-4">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {event.isLive ? (
            <Link
              to={`/event/${event._id}/register`}
              state={{ link: event.link }}
              className="text-blue-600 dark:text-blue-400 font-normal text-[12px]"
              onClick={(e) => e.stopPropagation()}
            >
              Register Here
            </Link>
          ) : (
            <span className="text-yellow-800 dark:text-yellow-400 font-normal text-[12px]">
              Registrations Closed
            </span>
          )}
          {
            <div className="cursor-pointer" onClick={handleDeleteEvent}>
              <FaTrash
                size={12}
                className="text-red-500 dark:text-red-700 hover:text-red-700"
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default EventCard;
