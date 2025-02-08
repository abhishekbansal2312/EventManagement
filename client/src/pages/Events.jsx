import React, { useEffect, useState } from "react";
import EventCard from "../components/event/EventCard";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Correct import
import Radio from "../components/Radio"; // Import Radio component
import Modal from "../components/Modal";
import CreateEvent from "../components/event/CreateEvent";
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast

const Events = ({ darkMode }) => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showAddEvent, setShowAddEvent] = useState(false); // Initialize showAddEvent state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("authtoken");
        if (token) {
          const decodedToken = jwtDecode(token);
          setIsAdmin(decodedToken.role === "admin");
          console.log(decodedToken.id);
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
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data.");
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
        const sortedEvents = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setEvents(sortedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error("Error fetching events."); // Use toast for error
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchEvents();
  }, []);

  // Function to filter events based on the selected option
  const filteredEvents = () => {
    if (filter === "participated" && user) {
      return events.filter((event) =>
        user.participatedEvents.includes(event._id.toString())
      );
    } else if (filter === "live") {
      return events.filter((event) => event.isLive);
    }
    return events; // Return all events if "all" is selected
  };

  // Options for the radio buttons
  const radioOptions = [
    { value: "all", label: "All Events" },
    { value: "participated", label: "Participated Events" },
    { value: "live", label: "Live Events" },
  ];

  const handleDeleteEvent = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
  };

  return (
    <div
      className={`min-h-screen px-4 md:px-8 lg:px-16 pb-4 ${
        darkMode ? "dark:bg-gray-900 text-white" : "text-gray-900"
      }`}
    >
      <div className="container pt-8 flex flex-wrap justify-between items-center">
        <Radio
          options={radioOptions}
          selectedValue={filter}
          handleChange={setFilter}
        />
        {isAdmin && (
          <button
            onClick={() => setShowAddEvent(true)}
            className="bg-blue-500 hover:bg-blue-700 text-[12px] sm:text-sm text-white font-normal py-2 px-4 rounded-md transition-colors duration-300"
          >
            Add Event
          </button>
        )}

        <Modal
          isOpen={showAddEvent}
          onClose={() => setShowAddEvent(false)}
          title="Add Event"
        >
          <CreateEvent setEvents={setEvents} />
        </Modal>
      </div>

      <div className="container mt-4">
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-400 rounded w-3/4 mb-4"></div>
              <div className="h-5 bg-gray-400 rounded w-2/4 mb-4"></div>
              <div className="h-5 bg-gray-400 rounded w-1/4"></div>
            </div>
          </div>
        )}

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-4">
          {filteredEvents().length > 0 ? (
            filteredEvents().map((event) => (
              <EventCard
                key={event._id}
                event={event}
                darkMode={darkMode}
                onDelete={handleDeleteEvent}
              />
            ))
          ) : (
            <div className="text-center col-span-full">
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
