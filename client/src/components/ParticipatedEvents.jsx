import React from 'react';

const ParticipatedEvents = ({ events }) => {
  // Function to format the date
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  if (!events || events.length === 0) {
    return <p>No participated events.</p>;
  }

  return (
    <ul className="mt-2 ml-4">
      {events.map(event => (
        <li key={event._id} className="border-b p-1">
          <a href={`http://localhost:3000/event/${event._id}`} className="text-blue-600 hover:underline">
            {event.title}
          </a> - {formatDate(event.date)} {/* Use the formatDate function */}
        </li>
      ))}
    </ul>
  );
};

export default ParticipatedEvents;
