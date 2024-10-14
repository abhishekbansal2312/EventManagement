import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies
import {jwtDecode }from 'jwt-decode'; // Import jwtDecode to decode JWT tokens
import MemberCard from "../components/Membercard"; // Import MemberCard component
import CreateMember from "../components/CreateMember"; // Import CreateMember component
import UpdateMemberForm from "../components/UpdateMemberForm"; // Import UpdateMemberForm component

const Members = ({ darkMode }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateMember, setShowCreateMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null); // State to track the member being edited
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = Cookies.get("authtoken"); // Fetch token from cookies

        if (!token) {
          console.error("No token found. Redirecting to login page...");
          setError("No token found. Redirecting to login page...");
          window.location.href = "/login"; // Redirect to login page
          return;
        }

        // Decode the token to get user role
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.role === "admin"); // Set admin status based on role

        const response = await fetch("http://localhost:4600/api/members", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include token in headers
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        const data = await response.json();
        setMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []); // Empty dependency array ensures this runs only once

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleEditMember = (member) => {
    setEditingMember(member); // Set the member to be edited
  };

  const handleCancelEdit = () => {
    setEditingMember(null); // Reset the editing member
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        const token = Cookies.get("authtoken"); // Fetch token from cookies
        const response = await fetch(`http://localhost:4600/api/members/${memberId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`, // Include token in headers
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete member");
        }

        // Remove the deleted member from the state
        setMembers((prev) => prev.filter((member) => member._id !== memberId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-white"
        } text-gray-700 ${
          darkMode ? "dark:text-gray-300" : "text-gray-900"
        } p-6`}
      >
       
        
        {isAdmin && (
          <button
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setShowCreateMember(!showCreateMember)}
          >
            {showCreateMember ? "Cancel" : "Add Member"}
          </button>
        )}

        {showCreateMember && (
          <CreateMember setMembers={setMembers} setError={setError} darkMode={darkMode} />
        )}

        {/* Update Member Section */}
        {editingMember && (
          <div className="my-4 p-4 border rounded bg-gray-100">
            <h2 className="text-xl font-semibold mb-2">Edit Member</h2>
            <UpdateMemberForm
              member={editingMember}
              onUpdate={(updatedMember) => {
                setMembers((prev) =>
                  prev.map((m) => (m._id === updatedMember._id ? updatedMember : m))
                );
                handleCancelEdit(); // Clear the editing member after update
              }}
              onCancel={handleCancelEdit} // Cancel edit
              darkMode={darkMode}
            />
          </div>
        )}

        {/* Members Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {members.map((member) => (
            <MemberCard
              key={member._id}
              member={member}
              darkMode={darkMode}
              setMembers={setMembers}
              isAdmin={isAdmin} 
              onEdit={isAdmin ? () => handleEditMember(member) : null} // Allow editing only if admin
              onDelete={isAdmin ? () => handleDeleteMember(member._id) : null} // Allow deleting only if admin
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Members;
