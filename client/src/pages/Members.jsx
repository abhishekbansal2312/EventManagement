import React, { useEffect, useState } from "react";

import { toast } from "react-hot-toast";

import MemberCard from "../components/member/Membercard";
import CreateMember from "../components/member/CreateMember";
import UpdateMemberForm from "../components/member/UpdateMemberForm";
import FacultyCard from "../components/faculty/FacultyCard";
import CreateFaculty from "../components/faculty/CreateFaculty";
import Modal from "../components/Modal";
import "../App.css";
import useAxios from "../utils/useAxios";

const Members = ({ darkMode }) => {
  const [members, setMembers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateMember, setShowCreateMember] = useState(false);
  const [showCreateFaculty, setShowCreateFaculty] = useState(false);

  const makeRequest = useAxios(); // Initialize makeRequest

  useEffect(() => {
    const fetchMembersAndFaculty = async () => {
      try {
        const [membersData, facultyData] = await Promise.all([
          makeRequest("http://localhost:4600/api/members", "GET", null, true),
          makeRequest("http://localhost:4600/api/faculty", "GET", null, true),
        ]);

        setMembers(
          membersData.sort(
            (a, b) => new Date(b.joinDate) - new Date(a.joinDate)
          )
        );
        setFaculty(
          facultyData.sort(
            (a, b) => new Date(b.joinDate) - new Date(a.joinDate)
          )
        );
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembersAndFaculty();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const handleDelete = async (url, id, setState) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await makeRequest(`${url}/${id}`, "DELETE", null, true);
        setState((prev) => prev.filter((item) => item._id !== id));
        toast.success("Item deleted successfully!");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 pb-4 pt-5 dark:bg-gray-900 dark:text-white bg-white text-black">
      <div className="min-h-screen transition duration-500">
        {/* Faculty Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Faculty Members</h2>
          {
            <button
              className="bg-blue-500 hover:bg-blue-700 text-[12px] text-white font-normal py-2 px-4 rounded-md transition-colors duration-300"
              onClick={() => setShowCreateFaculty(true)}
            >
              Add Faculty
            </button>
          }
        </div>

        <Modal
          isOpen={showCreateFaculty}
          title={"Add Faculty Member"}
          onClose={() => setShowCreateFaculty(false)}
        >
          <CreateFaculty
            setFaculty={setFaculty}
            onClose={() => setShowCreateFaculty(false)}
          />
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {faculty.map((facultyMember) => (
            <FacultyCard
              key={facultyMember._id}
              faculty={facultyMember}
              darkMode={darkMode}
              setFaculty={setFaculty}
              onDelete={() =>
                handleDelete(
                  "http://localhost:4600/api/faculty",
                  facultyMember._id,
                  setFaculty
                )
              }
            />
          ))}
        </div>

        <div className="flex justify-between items-center mt-8 mb-4">
          <h2 className="text-2xl font-semibold">Members</h2>
          {
            <button
              className="bg-blue-500 hover:bg-blue-700 text-[12px] text-white font-normal py-2 px-4 rounded-md transition-colors duration-300"
              onClick={() => setShowCreateMember(true)}
            >
              Add Member
            </button>
          }
        </div>

        <Modal
          isOpen={showCreateMember}
          onClose={() => setShowCreateMember(false)}
          title="Create Member"
        >
          <CreateMember
            setMembers={setMembers}
            darkMode={darkMode}
            onCancel={() => setShowCreateMember(false)}
          />
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.length === 0 ? (
            <p>No members found.</p>
          ) : (
            members.map((member) => (
              <MemberCard
                key={member._id}
                setMembers={setMembers}
                member={member}
                darkMode={darkMode}
                onDelete={() =>
                  handleDelete(
                    "http://localhost:4600/api/members",
                    member._id,
                    setMembers
                  )
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;
