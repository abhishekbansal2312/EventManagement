import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast"; // Updated to use react-hot-toast

import EventTask from "../components/event/EventTask.jsx";
import Participants from "../components/Participants.jsx";
import { FaTrash } from "react-icons/fa"; // Import the trash icon
import EventEdit from "../components/event/EventEdit.jsx";
import Modal from "../components/Modal.jsx";
import { useSelector } from "react-redux";

const EventPage = ({ darkMode }) => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participantIds, setParticipantIds] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const { user } = useSelector((state) => state.user);

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
      } catch (error) {
        toast.error(error.message); // Toast error message
      }
    };

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
      } catch (error) {
        toast.error(error.message); // Toast error message
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    fetchEvent();
  }, [id]);

  const handleParticipantChange = (e) => {
    setParticipantIds(e.target.value);
  };

  const handleAddParticipants = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:4600/api/events/${id}/participants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ studentIds: participantIds }),
        }
      );

      if (!response.ok) throw new Error("Error adding participants");

      const updatedEvent = await response.json();
      setEvent(updatedEvent.event);
      toast.success("Participants added successfully!");
      setParticipantIds("");
    } catch (error) {
      toast.error(error.message); // Toast error message
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    try {
      const response = await fetch(
        `http://localhost:4600/api/events/${id}/participants`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ studentIds: [participantId] }),
        }
      );

      if (!response.ok) throw new Error("Error removing participant");

      const updatedEvent = await response.json();
      setEvent(updatedEvent.event);
      toast.success("Participant removed successfully!");
    } catch (error) {
      toast.error(error.message); // Toast error message
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!event) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500">Event not found.</p>
      </div>
    );
  }

  const sortedParticipants = [...(event.participants || [])].sort((a, b) => {
    return (parseInt(a.studentId, 10) || 0) - (parseInt(b.studentId, 10) || 0);
  });

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } px-16 py-8`}
    >
      <div className="container mx-auto flex flex-col md:flex-row gap-4">
        {/* Left Side: Event Details */}
        <div className="flex-1 mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            {event.title}
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            {event.description}
          </p>

          <div className="mb-2">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </div>

          {event.time && (
            <div className="mb-2">
              <strong>Time:</strong> {event.time}
            </div>
          )}

          {event.location && (
            <div className="mb-2">
              <strong>Location:</strong> {event.location}
            </div>
          )}

          {event.link && (
            <div className="mb-2">
              <strong>Link:</strong>{" "}
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-500 transition"
              >
                Event Link
              </a>
            </div>
          )}

          <div
            className={`mb-4 ${
              event.isLive ? "text-green-500" : "text-red-500"
            }`}
          >
            <strong>Status:</strong> {event.isLive ? "Live" : "Not Live"}
          </div>

          {event.onlinePoster && (
            <div className="mb-4">
              <img
                src={event.onlinePoster}
                alt="Online Poster"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}

          {event.offlinePoster && (
            <div className="mb-4">
              <img
                src={event.offlinePoster}
                alt="Offline Poster"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}

          {user?.role === "admin" && (
            <div
              onClick={() => setShowEditEvent(true)}
              className="bg-blue-500 hover:bg-blue-700 text-[12px] sm:text-sm text-white font-normal py-2 px-4 rounded-md transition-colors duration-300"
            >
              Edit Event
            </div>
          )}
        </div>

        <Modal
          isOpen={showEditEvent}
          onClose={() => setShowEditEvent(false)}
          title="Edit Event"
        >
          <EventEdit
            event={event}
            setEvent={setEvent}
            darkMode={darkMode}
            onClose={() => setShowEditEvent(false)}
          />
        </Modal>

        <div className="flex-1">
          <EventTask
            tasks={tasks}
            setTasks={setTasks}
            darkMode={darkMode}
            eventId={id}
          />

          <Participants
            participantIds={participantIds}
            setParticipantIds={setParticipantIds}
            event={event}
            participants={sortedParticipants}
            handleAddParticipants={handleAddParticipants}
            handleRemoveParticipant={handleRemoveParticipant}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default EventPage;
