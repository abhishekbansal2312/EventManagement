import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 

const Gallery = ({ darkMode }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:4600/api/events', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Example: JWT token for authorization
                    },
                    credentials: 'include',  // Include credentials like cookies
                });

                if (!response.ok) throw new Error(response.statusText);

                const data = await response.json();
                setEvents(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <h1 className="text-3xl font-bold mb-6">Event Gallery</h1>

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-pulse">
                        <div className="h-5 bg-gray-400 rounded w-3/4 mb-4"></div>
                        <div className="h-5 bg-gray-400 rounded w-2/4 mb-4"></div>
                        <div className="h-5 bg-gray-400 rounded w-1/4"></div>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {events.length ? (
                        events.map((event) => (
                            <Link 
                                key={event._id}
                                to={`/gallery/${event._id}`} 
                                className={`p-4 rounded-lg shadow-md transition-all ${
                                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                                }`}
                            >
                                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                                {event.offlinePoster && (
                                    <img
                                        src={event.offlinePoster}
                                        alt={event.title}
                                        className="w-full h-auto rounded-md mb-2"
                                    />
                                )}
                            </Link>
                        ))
                    ) : (
                        <p className="text-center">No events available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Gallery;
