import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Correct import
import Radio from "../components/Radio"; // Import Radio component

const Events = ({ darkMode }) => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("authtoken");
        if (token) {
          const decodedToken = jwtDecode(token);
          setIsAdmin(decodedToken.role === "admin");

          const response = await fetch(
            `http://localhost:4600/api/users/${decodedToken.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );
          if (!response.ok) throw new Error("Failed to fetch user data");
          const userData = await response.json();
          setUser(userData); // Set user data
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("authtoken");
        const response = await fetch("http://localhost:4600/api/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        const sortedEvents = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(sortedEvents);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchEvents();
  }, []);

  // Function to filter events based on the selected option
  const filteredEvents = () => {
    if (filter === "participated") {
      // Ensure user and participatedEvents are defined
      if (user && Array.isArray(user.participatedEvents)) {
        return events.filter((event) =>
          user.participatedEvents.includes(event._id.toString())
        );
      }
      // Return an empty array if there's no participated data
      return [];
    } else if (filter === "live") {
      return events.filter((event) => event.isLive);
    }
    // Return all events if "all" is selected
    return events;
  };

  // Options for the radio buttons
  const radioOptions = [
    { value: "all", label: "All Events" },
    { value: "participated", label: "Participated Events" },
    { value: "live", label: "Live Events" },
  ];

  return (
    <div
      className={`min-h-screen px-16 ${
        darkMode ? "bg-gray-900 text-white" : "text-gray-900"
      }`}
    >
      <div className="container pt-8 flex justify-between">
        <Radio
          options={radioOptions}
          selectedValue={filter}
          handleChange={(value) => setFilter(value)}
        />
        {isAdmin && (
          <Link to="create-event" className="">
            <button className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-normal py-2 px-4 rounded">
              Create Event
            </button>
          </Link>
        )}
      </div>
      <div className="container mt-2">
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-400 rounded w-3/4 mb-4"></div>
              <div className="h-5 bg-gray-400 rounded w-2/4 mb-4"></div>
              <div className="h-5 bg-gray-400 rounded w-1/4"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-6 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 mt-4">
          {filteredEvents().length > 0 ? (
            filteredEvents().map((event) => (
              <EventCard key={event._id} event={event} darkMode={darkMode} />
            ))
          ) : (
            <div className="text-center">
              {filter === "participated" && user ? (
                <p>You have not participated in any events yet.</p>
              ) : (
                <p>No events available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
