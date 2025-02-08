import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Live = ({ darkMode }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        const sortedEvents = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setEvents(sortedEvents);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const liveEvents = events.filter((event) => event.isLive);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-10">
        <h1 className="text-5xl font-bold text-center mb-8">Live Events</h1>

        {loading && (
          <div className="flex justify-center items-center mb-4">
            <div className="loader"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p className="font-bold text-lg">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveEvents.length > 0 ? (
              liveEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-col items-center">
                    {event.onlinePoster && (
                      <img
                        src={event.onlinePoster}
                        alt="Online Poster"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    {event.offlinePoster && (
                      <img
                        src={event.offlinePoster}
                        alt="Offline Poster"
                        className="w-full h-48 object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2">
                      {event.title}
                    </h2>
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    <p className="text-gray-600">
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <strong>Time:</strong> {event.time}
                    </p>
                    <p className="text-gray-600">
                      <strong>Location:</strong> {event.location}
                    </p>
                    {event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline mt-4 block"
                      >
                        Register Here
                      </a>
                    )}

                    {event.participants.length > 0 && !event.isLive && (
                      <div className="mt-4">
                        <strong>Participants:</strong>
                        <ul className="list-disc list-inside text-gray-600">
                          {event.participants.map((participant) => (
                            <li key={participant._id} className="text-sm">
                              {participant.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-6">
                <h2 className="text-2xl font-bold">No Live Events Currently</h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Live;
