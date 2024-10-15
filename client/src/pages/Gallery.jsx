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
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    credentials: 'include',
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
        <div className={`relative flex min-h-screen flex-col overflow-hidden ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
                Event Gallery
            </h1>

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-pulse">
                        <div className="h-5 bg-gray-400 rounded w-3/4 mb-4"></div>
                        <div className="h-5 bg-gray-400 rounded w-2/4 mb-4"></div>
                        <div className="h-5 bg-gray-400 rounded w-1/4"></div>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg shadow-lg">
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
                                className="relative flex h-72 w-full max-w-xs rounded-xl shadow-xl ring-gray-900/5 overflow-hidden group"
                            >
                                <div className="z-10 h-full w-full overflow-hidden rounded-xl border border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 dark:opacity-70">
                                    <img
                                        src={event.offlinePoster || "https://via.placeholder.com/3149"} // Placeholder if no poster is available
                                        className="animate-fade-in block h-full w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110"
                                        alt={event.title}
                                    />
                                </div>
                                <div className="absolute bottom-0 z-20 m-0 pb-4 ps-4 bg-black  rounded-xl transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
                                    <h1 className="font-serif text-2xl font-bold text-white">{event.title}</h1>
                                    <h2 className="text-sm font-light text-gray-200">{event.description || "Description not available"}</h2>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-lg font-medium">No events available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Gallery;
