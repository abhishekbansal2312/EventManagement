import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import MemberCard from "../components/Membercard";
import CreateMember from "../components/CreateMember";
import UpdateMemberForm from "../components/UpdateMemberForm";
import FacultyCard from "../components/FacultyCard";
import CreateFaculty from "../components/CreateFaculty";
import "../App.css"

const Members = ({ darkMode }) => {
  const [members, setMembers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateMember, setShowCreateMember] = useState(false);
  const [showCreateFaculty, setShowCreateFaculty] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchMembersAndFaculty = async () => {
      try {
        const token = Cookies.get("authtoken");

        if (!token) {
          console.error("No token found. Redirecting to login page...");
          setError("No token found. Redirecting to login page...");
          window.location.href = "/login";
          return;
        }

        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.role === "admin");

        // Fetch members
        const membersResponse = await fetch("http://localhost:4600/api/members", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!membersResponse.ok) {
          throw new Error("Failed to fetch members");
        }

        const membersData = await membersResponse.json();
        setMembers(membersData);

        // Fetch faculty members
        const facultyResponse = await fetch("http://localhost:4600/api/faculty", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!facultyResponse.ok) {
          throw new Error("Failed to fetch faculty members");
        }

        const facultyData = await facultyResponse.json();
        setFaculty(facultyData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembersAndFaculty();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader"></div> {/* Add a loader animation here */}
    </div>
  );
  if (error) return <p className="text-red-500">{error}</p>;

  const handleEditMember = (member) => {
    setEditingMember(member);
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
  };

  const handleEditFaculty = (faculty) => {
    setEditingFaculty(faculty);
  };

  const handleCancelEditFaculty = () => {
    setEditingFaculty(null);
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        const token = Cookies.get("authtoken");
        const response = await fetch(`http://localhost:4600/api/members/${memberId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to delete member");
        }

        setMembers((prev) => prev.filter((member) => member?._id !== memberId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      try {
        const token = Cookies.get("authtoken");
        const response = await fetch(`http://localhost:4600/api/faculty/${facultyId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse error response
          throw new Error(errorData.message || "Failed to delete faculty member"); // Use error message from response
        }

        setFaculty((prev) => prev.filter((faculty) => faculty?._id !== facultyId)); // Optional chaining
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className={`min-h-screen transition duration-500 ${darkMode ? "bg-gray-900" : "bg-white"} p-6`}>
        {isAdmin && (
          <button
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:scale-105 transition-transform duration-300"
            onClick={() => setShowCreateFaculty(!showCreateFaculty)}
          >
            {showCreateFaculty ? "Cancel" : "Add Faculty"}
          </button>
        )}

        {showCreateFaculty && (
          <CreateFaculty setFaculty={setFaculty} setError={setError} darkMode={darkMode} />
        )}

        <h2 className="text-2xl font-semibold mb-4">Faculty Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {faculty.map((facultyMember) => (
            <FacultyCard
              key={facultyMember?._id}
              faculty={facultyMember}
              darkMode={darkMode}
              setFaculty={setFaculty}
              isAdmin={isAdmin}
              onEdit={isAdmin ? () => handleEditFaculty(facultyMember) : null}
              onDelete={isAdmin ? () => handleDeleteFaculty(facultyMember._id) : null}
            />
          ))}
        </div>

        {isAdmin && (
          <button
            className="mt-8 mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:scale-105 transition-transform duration-300"
            onClick={() => setShowCreateMember(!showCreateMember)}
          >
            {showCreateMember ? "Cancel" : "Add Member"}
          </button>
        )}

        {showCreateMember && (
          <CreateMember setMembers={setMembers} setError={setError} darkMode={darkMode} />
        )}

        {editingMember && (
          <div className="my-4 p-4 border rounded bg-gray-100 transition duration-300">
            <h2 className="text-xl font-semibold mb-2">Edit Member</h2>
            <UpdateMemberForm
              member={editingMember}
              onUpdate={(updatedMember) => {
                setMembers((prev) =>
                  prev.map((m) => (m?._id === updatedMember._id ? updatedMember : m))
                );
                handleCancelEdit();
              }}
              onCancel={handleCancelEdit}
              darkMode={darkMode}
            />
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {members.map((member) => (
            <MemberCard
              key={member?._id}
              member={member}
              darkMode={darkMode}
              setMembers={setMembers}
              isAdmin={isAdmin}
              onEdit={isAdmin ? () => handleEditMember(member) : null}
              onDelete={isAdmin ? () => handleDeleteMember(member._id) : null}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Members;
