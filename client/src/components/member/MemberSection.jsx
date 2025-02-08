import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import MemberCard from "./Membercard";
import CreateMember from "./CreateMember";
import Modal from "../Modal";
import useAxios from "../../utils/useAxios";

const MemberSection = ({ darkMode }) => {
  const [members, setMembers] = useState([]);
  const [showCreateMember, setShowCreateMember] = useState(false);
  const makeRequest = useAxios();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersData = await makeRequest(
          "http://localhost:4600/api/members",
          "GET",
          null,
          true
        );
        setMembers(
          membersData.sort(
            (a, b) => new Date(b.joinDate) - new Date(a.joinDate)
          )
        );
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchMembers();
  }, []);

  const handleDeleteMember = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await makeRequest(
          `http://localhost:4600/api/members/${id}`,
          "DELETE",
          null,
          true
        );
        setMembers((prev) => prev.filter((member) => member._id !== id));
        toast.success("Member deleted successfully!");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-2xl font-semibold">Members</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-[12px] text-white font-normal py-2 px-4 rounded-md transition-colors duration-300"
          onClick={() => setShowCreateMember(true)}
        >
          Add Member
        </button>
      </div>

      <Modal
        isOpen={showCreateMember}
        title="Create Member"
        onClose={() => setShowCreateMember(false)}
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
              member={member}
              darkMode={darkMode}
              onDelete={() => handleDeleteMember(member._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MemberSection;
