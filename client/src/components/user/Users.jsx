import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import UserForm from "./UserForm";
import UserList from "./UserList";
import Modal from "../Modal";
import useAxios from "../../utils/useAxios";

const Users = ({ darkMode }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const makeRequest = useAxios();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Set the number of items per page

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to the first page on search
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await makeRequest(
        "http://localhost:4600/api/users",
        "GET",
        null,
        true
      );
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:4600/api/users/${selectedUser}`
      : "http://localhost:4600/api/users";

    try {
      await makeRequest(url, method, formData, true);
      fetchUsers();
      resetForm();
      toast.success(
        isEditing ? "User updated successfully!" : "User created successfully!"
      );
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await makeRequest(
        `http://localhost:4600/api/users/${id}`,
        "DELETE",
        null,
        true
      );
      fetchUsers();
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleParticipatedEvents = async (id) => {
    if (events[id]) {
      setEvents({ ...events, [id]: undefined });
    } else {
      try {
        const fetchedEvents = await makeRequest(
          `http://localhost:4600/api/users/${id}/participated-events`,
          "GET",
          null,
          true
        );
        setEvents({ ...events, [id]: fetchedEvents });
      } catch (error) {
        console.error("Error fetching participated events:", error);
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user._id);
    setFormData({
      studentId: user.studentId,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setFormData({ studentId: "", name: "", email: "", password: "", role: "" });
    setSelectedUser(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <p className="min-h-screen flex justify-center items-center dark:bg-gray-900 dark:text-white">
        Loading users...
      </p>
    );
  }

  const commonButtonClass =
    "bg-blue-500 hover:bg-blue-700 text-[12px] text-white font-normal py-2 px-4 rounded-md transition-colors duration-300";

  return (
    <div className="px-16 py-8 dark:bg-gray-900 dark:text-white bg-white text-black">
      <div className="flex flex-row sm:flex-row justify-between items-center max-w-full pb-4">
        <h2 className="text-lg sm:text-2xl font-semibold">Users Management</h2>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className={commonButtonClass}
        >
          Add User
        </button>
      </div>

      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title={"Add User"}
        >
          <UserForm
            formData={formData}
            isEditing={isEditing}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
            darkMode={darkMode}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by Name or Student ID"
          className="w-full p-2 rounded-lg shadow border dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white border-gray-300 outline-none"
        />
      </div>

      <UserList
        users={currentUsers} // Use currentUsers for pagination
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleParticipatedEvents={handleParticipatedEvents}
        events={events}
        darkMode={darkMode}
      />

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 p-2 rounded-lg ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Users;
