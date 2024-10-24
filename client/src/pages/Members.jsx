import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import MemberCard from "../components/member/Membercard";
import CreateMember from "../components/member/CreateMember";
import UpdateMemberForm from "../components/member/UpdateMemberForm";
import FacultyCard from "../components/faculty/FacultyCard";
import CreateFaculty from "../components/faculty/CreateFaculty";
import Modal from "../components/Modal";
import "../App.css";

const Members = ({ darkMode }) => {
  const [members, setMembers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateMember, setShowCreateMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
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
  
        // Sort members by join date (assuming joinDate is a valid date string)

        const sortedFaculties = facultyData.sort((a, b) => 
          new Date(b.joinDate) - new Date(a.joinDate)  // Reverse order
        );
        const sortedMembers = membersData.sort((a, b) => 
          new Date(b.joinDate) - new Date(a.joinDate)  // Reverse order
        );
  
        setMembers(sortedMembers);
        setFaculty(sortedFaculties);
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

  const handleUpdateFaculty = (updatedFaculty) => {
    setFaculty((prevFaculty) =>
      prevFaculty.map((faculty) =>
        faculty._id === updatedFaculty._id ? updatedFaculty : faculty
      )
    );
  };

  return (
    <div className="px-16 py-8 dark:bg-gray-900 dark:text-white bg-white text-black">
      <div className="min-h-screen transition duration-500">
        {/* Faculty Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Faculty Members</h2>
          {isAdmin && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-[12px] text-white font-normal py-2 px-4 rounded-md transition-colors duration-300"
              onClick={() => setShowCreateFaculty(true)}
            >
              Add Faculty
            </button>
          )}
        </div>

        <Modal
          isOpen={showCreateFaculty}
          title={"Add Faculty Member"}
          onClose={() => setShowCreateFaculty(false)}
        >
          <CreateFaculty setFaculty={setFaculty} setError={setError} />
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {faculty.map((facultyMember) => (
            <FacultyCard
  key={facultyMember._id}
  faculty={facultyMember}
  darkMode={darkMode}
  setFaculty={setFaculty}
  isAdmin={isAdmin}
  onUpdate={handleUpdateFaculty} 
  onEdit={isAdmin ? () => {
      setEditingFaculty(facultyMember);
    } : null}
  onDelete={
    isAdmin
      ? () =>
          handleDelete(
            "http://localhost:4600/api/faculty",
            facultyMember._id,
            setFaculty
          )
      : () => {}
  }
/>

          ))}
        </div>

        {/* Members Section */}
        <div className="flex justify-between items-center mt-8 mb-4">
          <h2 className="text-2xl font-semibold">Members</h2>
          {isAdmin && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-[12px] text-white font-normal py-2 px-4 rounded-md transition-colors duration-300"
              onClick={() => setShowCreateMember(true)}
            >
              Add Member
            </button>
          )}
        </div>

        <Modal
          isOpen={showCreateMember}
          onClose={() => setShowCreateMember(false)}
          title="Create Member"
        >
          <CreateMember
            setMembers={setMembers}
            setError={setError}
            darkMode={darkMode}
          />
        </Modal>

        <Modal
          isOpen={showEditMember}
          onClose={() => setShowEditMember(false)}
          title="Edit                                      Member"
        >
          <UpdateMemberForm
            setError={setError}
            member={editingMember}
            onCancel={() => {
              setEditingMember(null);
              console.log(darkMode);
            }}
            setMembers={setMembers}
            darkMode={true}
          />
        </Modal>

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
