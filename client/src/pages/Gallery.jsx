import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Gallery = ({ darkMode }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://hobbiesclub-my9i.onrender.com/api/events",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-8 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <h1 className="text-5xl font-bold mb-12 text-center text-gray-800 dark:text-white">
        Event Gallery
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-72">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-5 bg-gray-400 rounded w-3/4"></div>
            <div className="h-5 bg-gray-400 rounded w-1/2"></div>
            <div className="h-5 bg-gray-400 rounded w-1/4"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg shadow-lg">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.length ? (
            events.map((event) => (
              <Link
                key={event._id}
                to={`/gallery/${event._id}`}
                className="flex flex-col rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:scale-105"
              >
                <div className="h-72 w-full overflow-hidden rounded-t-2xl transition duration-300 ease-in-out">
                  <img
                    src={
                      event.offlinePoster || "https://via.placeholder.com/3149"
                    } // Placeholder if no poster is available
                    className="animate-fade-in block h-full w-full object-cover object-center transition duration-300"
                    alt={event.title}
                  />
                </div>
                <div className="flex-1 p-4 bg-white dark:bg-gray-800 rounded-b-2xl">
                  <h1 className="font-serif text-xl font-bold text-gray-800 dark:text-white">
                    {event.title}
                  </h1>
                  <h2 className="text-sm font-light text-gray-600 dark:text-gray-400">
                    {event.description || "Description not available"}
                  </h2>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-lg font-medium text-gray-600 dark:text-gray-400">
              No events available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
