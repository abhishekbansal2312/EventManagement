import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";

import useAxios from "../utils/useAxios.jsx"; // Import custom Axios hook
import EventTask from "../components/event/EventTask.jsx";
import Participants from "../components/Participants.jsx";
import EventEdit from "../components/event/EventEdit.jsx";
import Modal from "../components/Modal.jsx";

const EventPage = ({ darkMode }) => {
  const { id } = useParams();
  const makeRequest = useAxios(); // Use custom Axios hook
  const { user } = useSelector((state) => state.user);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participantIds, setParticipantIds] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showEditEvent, setShowEditEvent] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventData = await makeRequest(
          `http://localhost:4600/api/events/${id}`,
          "GET"
        );
        setEvent(eventData);
      } catch (error) {
        toast.error("Event not found");
      } finally {
        setLoading(false);
      }
    };

    const fetchTasksData = async () => {
      try {
        const tasksData = await makeRequest(
          `http://localhost:4600/api/tasks/${id}`,
          "GET"
        );
        setTasks(tasksData);
      } catch (error) {
        toast.error("Error fetching tasks");
      }
    };

    fetchEventData();
    fetchTasksData();
  }, [id]);

  const handleAddParticipants = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = await makeRequest(
        `/api/events/${id}/participants`,
        "POST",
        { studentIds: participantIds },
        true
      );
      setEvent(updatedEvent.event);
      toast.success("Participants added successfully!");
      setParticipantIds("");
    } catch (error) {
      toast.error("Error adding participants");
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    try {
      const updatedEvent = await makeRequest(
        `/api/events/${id}/participants`,
        "DELETE",
        { studentIds: [participantId] },
        true
      );
      setEvent(updatedEvent.event);
      toast.success("Participant removed successfully!");
    } catch (error) {
      toast.error("Error removing participant");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!event)
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-red-500">Event not found.</p>
      </div>
    );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } px-16 py-8`}
    >
      <div className="container mx-auto flex flex-col md:flex-row gap-4">
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
              <strong>Link:</strong>
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
            <img
              src={event.onlinePoster}
              alt="Online Poster"
              className="w-full rounded-lg shadow-lg mb-4"
            />
          )}
          {event.offlinePoster && (
            <img
              src={event.offlinePoster}
              alt="Offline Poster"
              className="w-full rounded-lg shadow-lg mb-4"
            />
          )}
          {user?.role === "admin" && (
            <button
              onClick={() => setShowEditEvent(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
            >
              Edit Event
            </button>
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
            participants={event.participants || []}
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
