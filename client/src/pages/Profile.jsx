import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get("authtoken");
  let id = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      id = decoded?.id; // Assuming the token has an 'id' field
    } catch (e) {
      setError("Invalid token");
      setLoading(false);
    }
  }

  const handleParticipatedEvents = async (id) => {
    if (events[id]) {
      setEvents({ ...events, [id]: undefined }); // Toggle visibility
    } else {
      try {
        const response = await fetch(
          `http://localhost:4600/api/users/${id}/participated-events`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const fetchedEvents = await response.json();
        if (response.ok) {
          setEvents({ ...events, [id]: fetchedEvents });
        } else {
          console.error(fetchedEvents.message);
        }
      } catch (error) {
        console.error("Error fetching participated events:", error);
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setError("No valid user ID found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4600/api/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      {profile && (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <h2>Participated Events</h2>
          {profile.participatedEvents?.length > 0 ? (
            profile.participatedEvents.map((event) => (
              <div key={event.id}>
                <p>Event Name: {event.eventName}</p>
                <button onClick={() => handleParticipatedEvents(event.id)}>
                  {events[event.id] ? "Hide Details" : "Show Details"}
                </button>
                {events[event.id] && (
                  <div>
                    {/* Render additional event details if available */}
                    <p>Details: {events[event.id].details}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No events participated</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
