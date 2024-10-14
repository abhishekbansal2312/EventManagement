import React from 'react';

const ParticipatedEvents = ({ events }) => {
  if (!events || events.length === 0) {
    return <p>No participated events.</p>;
  }

  return (
    <ul className="mt-2 ml-4">
      {events.map(event => (
        <li key={event._id} className="border-b p-1">
          <a href={`http://localhost:3000/event/${event._id}`} className="text-blue-600 hover:underline">
            {event.title}
          </a> - {event.date}
        </li>
      ))}
    </ul>
  );
};

export default ParticipatedEvents;
