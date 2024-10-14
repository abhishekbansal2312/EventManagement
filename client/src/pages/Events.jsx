import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Events = ({ darkMode }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // Track if user is admin

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true); // Start loading
                const token = Cookies.get("authtoken"); // Fetch token from cookies
                
                if (token) {
                    // Decode the token to check user role
                    const decodedToken = jwtDecode(token);
                    setIsAdmin(decodedToken.role === "admin"); // Check if the user is admin
                } else {
                    setIsAdmin(false);
                }

                const response = await fetch('http://localhost:4600/api/events', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // Include token in headers
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                const data = await response.json();

                // Sort events by date in descending order (newest first)
                const sortedEvents = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setEvents(sortedEvents);
                setError(null); // Clear any previous errors
            } catch (err) {
                setError(err.message); // Set error message if the request fails
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "text-gray-900"}`}>
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
                {/* Only show the Create Event button if the user is an admin */}
                {isAdmin && (
                    <button>
                        <Link to="create-event" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Create Event
                        </Link>
                    </button>
                )}
            </div>
            
            <div className="container mx-auto px-4 md:px-8 lg:px-12">
                {/* Show loading message */}
                {loading && (
                    <div className="flex justify-center items-center">
                        {/* Skeleton loader */}
                        <div className="animate-pulse">
                            <div className="h-5 bg-gray-400 rounded w-3/4 mb-4"></div>
                            <div className="h-5 bg-gray-400 rounded w-2/4 mb-4"></div>
                            <div className="h-5 bg-gray-400 rounded w-1/4"></div>
                        </div>
                    </div>
                )}

                {/* Show error message if any */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p className="font-bold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Render event cards */}
                {!loading && !error && (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <EventCard key={event._id} event={event} darkMode={darkMode} />
                            ))
                        ) : (
                            <div className="text-center">
                                <p>No events available.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
