import { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import { useSelector } from "react-redux";

const Profile = () => {
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const makeRequest = useAxios();

  const { user } = useSelector((state) => state.user);
  console.log(user);

  const handleParticipatedEvents = async (eventId) => {
    if (events[eventId]) {
      setEvents((prev) => ({ ...prev, [eventId]: undefined }));
    } else {
      try {
        const fetchedEvent = await makeRequest(
          `http://localhost:4600/api/events/${eventId}`,
          "GET",
          null,
          true
        );
        setEvents((prev) => ({ ...prev, [eventId]: fetchedEvent }));
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    }
  };

  if (!user) return <p>Loading user data...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <h2>Participated Events</h2>
      {user.participatedEvents?.length > 0 ? (
        user.participatedEvents.map((eventId) => (
          <div key={eventId}>
            <p>Event ID: {eventId}</p>{" "}
            {/* Temporary until we fetch event names */}
            <button onClick={() => handleParticipatedEvents(eventId)}>
              {events[eventId] ? "Hide Details" : "Show Details"}
            </button>
            {events[eventId] && (
              <div>
                <p>Event Name: {events[eventId].eventName}</p>
                <p>Details: {events[eventId].details}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No events participated</p>
      )}
    </div>
  );
};

export default Profile;
