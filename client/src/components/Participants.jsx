// src/components/Participants.jsx
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa"; // Import the trash icon
import { ToastContainer, toast } from "react-toastify";

const Participants = ({ event, handleAddParticipants, setParticipantIds, handleRemoveParticipant, isAdmin, darkMode, participantIds }) => {

  const handleParticipantChange = (e) => {
    setParticipantIds(e.target.value);
  };

  const sortedParticipants = [...(event?.participants || [])].sort((a, b) => {
    return (parseInt(a.studentId, 10) || 0) - (parseInt(b.studentId, 10) || 0);
  });

  return (
    <div className="flex-1 pl-0 md:pl-4">
      <ToastContainer />
      <div>
        <h2 className="text-2xl font-semibold mt-6 mb-4">Participants</h2>

        {isAdmin && (
          <form onSubmit={handleAddParticipants} className="mt-6 flex flex-col md:flex-row items-center mb-2">
            <input
              type="text"
              placeholder="Enter participant IDs separated by commas"
              value={participantIds}
              onChange={handleParticipantChange}
              className="border rounded-md px-4 py-2 mb-2 md:mb-0 md:mr-2 flex-grow"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
            >
              Add Participants
            </button>
          </form>
        )}

        <table className={`min-w-full border-collapse ${darkMode ? "border-gray-700" : "border-gray-300"} rounded-lg shadow-md`}>
          <thead>
            <tr className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} text-left text-sm uppercase tracking-wider`}>
              <th className={`px-6 py-4 font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Name</th>
              <th className={`px-6 py-4 font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Student ID</th>
              {isAdmin && (
                <th className={`px-6 py-4 font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Remove</th>
              )}
            </tr>
          </thead>
          <tbody className={`${darkMode ? "text-gray-400" : "text-gray-800"} text-sm`}>
            {sortedParticipants.length > 0 ? (
              sortedParticipants.map((participant, index) => (
                <tr key={index} className={`${darkMode ? "bg-gray-900" : "bg-white"} hover:scale-[1.02] transform transition-transform duration-200 ease-out hover:shadow`}>
                  <td className="px-6 py-4 border-b border-gray-600">{participant.name}</td>
                  <td className="px-6 py-4 border-b border-gray-600">{participant.studentId}</td>
                  {isAdmin && (
                    <td className="px-6 py-4 border-b border-gray-600">
                      <button onClick={() => handleRemoveParticipant(participant.studentId)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 3 : 2} className="text-center px-6 py-4 border-b border-gray-600">No participants yet.</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Participants;
