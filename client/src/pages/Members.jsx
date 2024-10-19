import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import MemberCard from "../components/Membercard";
import CreateMember from "../components/CreateMember";
import UpdateMemberForm from "../components/UpdateMemberForm";
import FacultyCard from "../components/FacultyCard";
import CreateFaculty from "../components/CreateFaculty";
import Modal from "../components/Modal";
import "../App.css";

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

        // Fetch members and faculty concurrently
        const [membersResponse, facultyResponse] = await Promise.all([
          fetch("http://localhost:4600/api/members", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }),
          fetch("http://localhost:4600/api/faculty", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }),
        ]);

        if (!membersResponse.ok) throw new Error("Failed to fetch members");
        if (!facultyResponse.ok) throw new Error("Failed to fetch faculty");

        const [membersData, facultyData] = await Promise.all([
          membersResponse.json(),
          facultyResponse.json(),
        ]);

        setMembers(membersData);
        setFaculty(facultyData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembersAndFaculty();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> {/* Add loader animation */}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const handleDelete = async (url, id, setState) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = Cookies.get("authtoken");
        const response = await fetch(`${url}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete item");
        }

        setState((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUpdateMember = (updatedMember) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member._id === updatedMember._id ? updatedMember : member
      )
    );
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className={`min-h-screen transition duration-500 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        } p-6`}
      >
        {/* Faculty Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Faculty Members</h2>
          {isAdmin && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowCreateFaculty(true)}
            >
              Add Faculty
            </button>
          )}
        </div>

        <Modal
          isOpen={showCreateFaculty}
          onClose={() => setShowCreateFaculty(false)}
        >
          <CreateFaculty
            setFaculty={setFaculty}
            setError={setError}
            darkMode={darkMode}
          />
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {faculty.map((facultyMember) => (
            <FacultyCard
              key={facultyMember._id}
              faculty={facultyMember}
              darkMode={darkMode}
              setFaculty={setFaculty}
              isAdmin={isAdmin}
              onEdit={isAdmin ? () => setEditingFaculty(facultyMember) : null}
              onDelete={
                isAdmin
                  ? () =>
                      handleDelete(
                        "http://localhost:4600/api/faculty",
                        facultyMember._id,
                        setFaculty
                      )
                  : null
              }
            />
          ))}
        </div>

        {/* Members Section */}
        <div className="flex justify-between items-center mt-8 mb-4">
          <h2 className="text-2xl font-semibold">Members</h2>
          {isAdmin && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowCreateMember(true)}
            >
              Add Member
            </button>
          )}
        </div>

        <Modal
          isOpen={showCreateMember}
          onClose={() => setShowCreateMember(false)}
        >
          <CreateMember
            setMembers={setMembers}
            setError={setError}
            darkMode={darkMode}
          />
        </Modal>

        {editingMember && (
          <div className="my-4 p-4 border rounded bg-gray-100">
            <h2 className="text-xl font-semibold mb-2">Edit Member</h2>
            <UpdateMemberForm
              setError={setError}
              member={editingMember}
              onUpdate={(updatedMember) => {
                handleUpdateMember(updatedMember);
                setEditingMember(null);
              }}
              onCancel={() => setEditingMember(null)}
              darkMode={darkMode}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.length === 0 ? (
            <p>No members found.</p>
          ) : (
            members.map((member) =>
              member ? (
                <MemberCard
                  key={member._id}
                  setMembers={setMembers}
                  setError={setError}
                  isAdmin={isAdmin}
                  member={member}
                  darkMode={darkMode}
                  onUpdate={handleUpdateMember}
                  onDelete={() =>
                    handleDelete(
                      "http://localhost:4600/api/members",
                      member._id,
                      setMembers
                    )
                  }
                  onEdit={() => setEditingMember(member)}
                />
              ) : null
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;
