import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserForm from "./UserForm";
import UserList from "./UserList";
import Modal from "../Modal";

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("authtoken");
      const response = await fetch("http://localhost:4600/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authtoken");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:4600/api/users/${selectedUser}`
      : "http://localhost:4600/api/users";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (response.ok) {
        fetchUsers();
        resetForm();
        toast.success(
          isEditing
            ? "User updated successfully!"
            : "User created successfully!"
        );
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user.");
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

  const handleDelete = async (id) => {
    const token = Cookies.get("authtoken");
    try {
      const response = await fetch(`http://localhost:4600/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        fetchUsers();
        toast.success("User deleted successfully!");
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleParticipatedEvents = async (id) => {
    if (events[id]) {
      setEvents({ ...events, [id]: undefined });
    } else {
      const token = Cookies.get("authtoken");
      try {
        const response = await fetch(
          `http://localhost:4600/api/users/${id}/participated-events`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const fetchedEvents = await response.json();
        if (response.ok) {
          setEvents({ ...events, [id]: fetchedEvents });
        } else {
          console.error(fetchedEvents.message);
        }
      } catch (error) {
        console.error("Error fetching participated events:", error);
      }
    }
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
    <div className="px-16 dark:bg-gray-900 dark:text-white bg-white text-black">
      <ToastContainer />
      <div className="flex justify-between items-center pb-4 pt-8">
        <h1 className="text-xl font-bold">User Management</h1>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className={commonButtonClass} // Assuming you have this defined like in the Members page
        >
          Add User
        </button>
      </div>

      {showForm && (
        <>
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
        </>
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
        users={filteredUsers}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleParticipatedEvents={handleParticipatedEvents}
        events={events}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Users;
