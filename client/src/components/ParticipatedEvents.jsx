import React from "react";

const ParticipatedEvents = ({ events }) => {
  // Function to format the date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Function to format time into 12-hour with AM/PM
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (!events || events.length === 0) {
    return <p className="text-[12px]">No participated events.</p>;
  }

  return (
    <ul className="">
      {events.map((event) => (
        <li key={event._id} className="text-[12px]"> {/* Added key here */}
          <a
            href={`http://localhost:3000/event/${event._id}`}
            className="text-blue-600 hover:underline"
          >
            {event.title}
          </a>
          - {formatDate(event.date)} at {formatTime(event.time)}
        </li>
      ))}
    </ul>
  );
};

export default ParticipatedEvents;
