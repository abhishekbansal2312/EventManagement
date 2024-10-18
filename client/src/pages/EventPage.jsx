import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import EventTask from "../components/EventTask.jsx";

const EventPage = ({ darkMode }) => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participantIds, setParticipantIds] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:4600/api/tasks/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error fetching tasks");

        const data = await response.json();
        setTasks(data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [id]);

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
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const checkUserRole = () => {
      const token = Cookies.get("authtoken");
      if (token) {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.role === "admin");
      }
    };

    fetchEvent();
    checkUserRole();
  }, [id]);

  const handleParticipantChange = (e) => {
    setParticipantIds(e.target.value);
  };

  const handleAddParticipants = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4600/api/events/${id}/participants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ studentIds: participantIds }),
      });

      if (!response.ok) throw new Error("Error adding participants");

      const updatedEvent = await response.json();
      setEvent(updatedEvent.event); // Ensure updated participants are included
      toast.success("Participants added successfully!");
      setParticipantIds("");
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

  if (!event) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500">Event not found.</p>
      </div>
    );
  }

  // Sort participants in ascending order by studentId (numerically)
  const sortedParticipants = [...(event.participants || [])].sort((a, b) => {
    return (parseInt(a.studentId, 10) || 0) - (parseInt(b.studentId, 10) || 0); // Numeric sorting
  });

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "text-gray-900"} py-10`}>
      <ToastContainer />
      <div className="container mx-auto p-4 flex flex-col md:flex-row">
        {/* Left Side: Event Details */}
        <div className="flex-1 pr-0 md:pr-4 mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
          <p className="mb-4 text-lg">{event.description}</p>

          <div className="mb-4">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </div>

          {event.time && (
            <div className="mb-4">
              <strong>Time:</strong> {event.time}
            </div>
          )}

          {event.location && (
            <div className="mb-4">
              <strong>Location:</strong> {event.location}
            </div>
          )}

          {event.link && (
            <div className="mb-4">
              <strong>Link:</strong>{" "}
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Event Link
              </a>
            </div>
          )}

          <div className={`mb-4 ${event.isLive ? "text-green-500" : "text-red-500"}`}>
            <strong>Status:</strong> {event.isLive ? "Live" : "Not Live"}
          </div>

          {event.onlinePoster && (
            <div className="bg-white border border-gray-300 p-4 rounded mb-4">
              <strong>Online Poster:</strong>
              <img src={event.onlinePoster} alt="Online Poster" className="w-full h-auto rounded" />
            </div>
          )}

          {event.offlinePoster && (
            <div className="bg-white border border-gray-300 p-4 rounded mb-4">
              <strong>Offline Poster:</strong>
              <img src={event.offlinePoster} alt="Offline Poster" className="w-full h-auto rounded" />
            </div>
          )}

          {isAdmin && (
            <a href={`/event/${id}/edit`} className="bg-yellow-500 text-white py-2 px-4 rounded">
              Edit Event
            </a>
          )}
        </div>

        {/* Right Side: Participants */}
        <div className="flex-1 pl-0 md:pl-4">
          <div>
            <EventTask tasks={tasks} darkMode={darkMode} eventId={id}/>
          </div>
          <h2 className="text-2xl font-bold mb-4">Participants</h2>

          {/* Table for participants */}
          <table className={`min-w-full border border-gray-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <thead>
              <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Student ID</th>
                <th className="border px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {sortedParticipants.length > 0 ? (
                sortedParticipants.map((participant, index) => (
                  <tr key={index} className={`hover:bg-gray-600 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}>
                    <td className="border px-4 py-2">{participant.name}</td>
                    <td className="border px-4 py-2">{participant.studentId}</td>
                    <td className="border px-4 py-2">{participant.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border px-4 py-2 text-center">No participants yet.</td>
                </tr>
              )}
            </tbody>
          </table>

          {isAdmin && (
            <form onSubmit={handleAddParticipants} className="mt-4">
              <input
                type="text"
                value={participantIds}
                onChange={handleParticipantChange}
                placeholder="Enter participant IDs (comma separated)"
                className="border rounded py-2 px-4 w-full"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
              >
                Add Participants
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
