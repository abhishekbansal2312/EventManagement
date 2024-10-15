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

                const response = await fetch('http://localhost:4600/api/events', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                const data = await response.json();
                const sortedEvents = data.sort((a, b) => new Date(b.date) - new Date(a.date));
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

    const liveEvents = events.filter(event => event.isLive);

    return (
        <div className={`min-h-screen flex flex-col items-center justify-start ${darkMode ? "bg-gradient-to-b from-gray-900 to-black text-white" : "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900"}`}>
            <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
                <h1 className="text-5xl font-bold text-center mb-10 animate-pulse">Live Events</h1>

                {loading && (
                    <div className="flex justify-center items-center mb-4">
                        <div className="animate-pulse">
                            <div className="h-5 bg-gray-400 rounded w-3/4 mb-2"></div>
                            <div className="h-5 bg-gray-400 rounded w-2/4 mb-2"></div>
                            <div className="h-5 bg-gray-400 rounded w-1/4"></div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                        <p className="font-bold text-lg">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="flex flex-col space-y-6">
                        {liveEvents.length > 0 ? (
                            <div className="grid gap-6 grid-cols-1 mt-4">
                                {liveEvents.map((event) => (
                                    <div key={event._id} className="border rounded-lg shadow-md p-6 bg-white dark:bg-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                        {/* Online Poster Column */}
                                        {event.onlinePoster && (
                                            <div className="flex justify-center mb-4">
                                                <img src={event.onlinePoster} alt="Online Poster" className="w-48 h-72 object-cover rounded-md shadow-lg transform transition-transform duration-300 hover:scale-105" />
                                            </div>
                                        )}
                                        {/* Offline Poster Column */}
                                        {event.offlinePoster && (
                                            <div className="flex justify-center mb-4">
                                                <img src={event.offlinePoster} alt="Offline Poster" className="w-48 h-72 object-cover rounded-md shadow-lg transform transition-transform duration-300 hover:scale-105" />
                                            </div>
                                        )}
                                        {/* Event Details Column */}
                                        <div className="flex flex-col justify-between">
                                            <h2 className="text-3xl font-semibold mb-2 hover:text-blue-500 transition-colors duration-200">{event.title}</h2>
                                            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">{event.description}</p>
                                            <div className="space-y-2">
                                                <p className="text-gray-600 dark:text-gray-400 text-sm"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm"><strong>Time:</strong> {event.time}</p>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm"><strong>Location:</strong> {event.location}</p>
                                            </div>
                                            {event.link && (
                                                <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 hover:text-blue-700 transition-colors duration-200">
                                                    More Details
                                                </a>
                                            )}
                                            {event.isLive ? (
                                                <div className="mt-2">
                                                    <a href="/register" className="text-blue-500 underline hover:text-blue-700 transition-colors duration-200">
                                                        Register Here
                                                    </a>
                                                </div>
                                            ) : (
                                                event.participants.length > 0 && (
                                                    <div className="mt-2">
                                                        <strong>Participants:</strong>
                                                        <ul className="list-disc list-inside">
                                                            {event.participants.map(participant => (
                                                                <li key={participant._id} className="text-sm">{participant.name}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
