import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import FacultyCard from "./FacultyCard";
import CreateFaculty from "./CreateFaculty";
import Modal from "../Modal";
import useAxios from "../../utils/useAxios";

const FacultySection = ({ darkMode }) => {
  const [faculty, setFaculty] = useState([]);
  const [showCreateFaculty, setShowCreateFaculty] = useState(false);
  const makeRequest = useAxios();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const facultyData = await makeRequest(
          "http://localhost:4600/api/faculty",
          "GET",
          null,
          true
        );
        setFaculty(
          facultyData.sort(
            (a, b) => new Date(b.joinDate) - new Date(a.joinDate)
          )
        );
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchFaculty();
  }, []);

  const handleDeleteFaculty = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this faculty member?")
    ) {
      try {
        await makeRequest(
          `http://localhost:4600/api/faculty/${id}`,
          "DELETE",
          null,
          true
        );
        setFaculty((prev) => prev.filter((faculty) => faculty._id !== id));
        toast.success("Faculty member deleted successfully!");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleUpdateFaculty = (updatedFaculty) => {
    setFaculty((prevFaculty) =>
      prevFaculty.map((faculty) =>
        faculty._id === updatedFaculty._id ? updatedFaculty : faculty
      )
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Faculty Members</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-[12px] text-white font-normal py-2 px-4 rounded-md transition-colors duration-300"
          onClick={() => setShowCreateFaculty(true)}
        >
          Add Faculty
        </button>
      </div>

      <Modal
        isOpen={showCreateFaculty}
        title="Add Faculty Member"
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
            onDelete={() => handleDeleteFaculty(facultyMember._id)}
            onUpdate={handleUpdateFaculty}
          />
        ))}
      </div>
    </div>
  );
};

export default FacultySection;
