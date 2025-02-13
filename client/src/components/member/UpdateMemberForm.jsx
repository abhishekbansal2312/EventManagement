import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { toast } from "react-hot-toast"; // Import toast
import useAxios from "../../utils/useAxios";

const UpdateMember = ({ member, setMembers, onCancel }) => {
  const [updatedMember, setUpdatedMember] = useState({
    name: member.name || "",
    email: member.email || "",
    studentId: member.studentId || "",
    pictureURL: null,
    description: member.description || "",
    hobbies: member.hobbies || "",
    phoneNumber: member.phoneNumber || "",
    isActive: member.isActive || true,
    joinDate: member.joinDate || "",
  });

  const makeRequest = useAxios();

  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setUpdatedMember({ ...updatedMember, pictureURL: file });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUpdatedMember({ ...updatedMember, pictureURL: file });
    }
    setDragging(false);
  };

  const handleUpdateMember = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      const pictureURL = updatedMember.pictureURL
        ? await uploadPicture(updatedMember.pictureURL)
        : member.pictureURL;

      await updateMemberData(pictureURL);
      toast.success("Member updated successfully!"); // Display success toast
    } catch (err) {
      console.error("Error updating member: ", err);
      toast.error("Error updating member: " + err.message); // Display error toast
    }
  };

  const uploadPicture = async (file) => {
    const storageRef = ref(storage, `members/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true); // Show uploading state

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Monitor progress if needed
        },
        (error) => {
          console.error("Error during upload: ", error);
          setUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL: ", downloadURL);
          setUploading(false);
          resolve(downloadURL); // Resolve with the download URL
        }
      );
    });
  };

  const updateMemberData = async (pictureURL) => {
    try {
      const updatedData = {
        ...updatedMember,
        pictureURL,
        joinDate: updatedMember.joinDate || new Date().toISOString(),
      };

      const url = `http://localhost:4600/api/members/${member._id}`;
      const response = await makeRequest(url, "PUT", updatedData, true);

      setMembers((prevMembers) =>
        prevMembers.map((m) => (m._id === member._id ? response : m))
      );

      console.log("Updated member data: ", response);
      onCancel();

      setUpdatedMember({
        name: "",
        email: "",
        studentId: "",
        pictureURL: null,
        description: "",
        hobbies: "",
        phoneNumber: "",
        isActive: true,
        joinDate: member.joinDate || new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      toast.error(error.message || "Failed to update member");
    }
  };

  return (
    <form
      onSubmit={handleUpdateMember}
      className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[14px]"
    >
      <div
        className={`mb-2 border-2 border-dashed rounded-lg p-4 transition col-span-2 ${
          dragging ? "border-blue-500" : ""
        } dark:border-gray-300
              border-gray-600`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex items-center justify-center h-14">
          {updatedMember.pictureURL ? (
            <p>{updatedMember.pictureURL.name}</p>
          ) : (
            <p className="text-gray-400">
              Drag and drop a file here, or click to select a file
            </p>
          )}
        </div>
      </div>
      <div className="mb-2">
        <label
          htmlFor="name"
          className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
        >
          Name
        </label>
        <input
          type="text"
          placeholder="Enter member name"
          value={updatedMember.name}
          onChange={(e) =>
            setUpdatedMember({ ...updatedMember, name: e.target.value })
          }
          required
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="email"
          className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
        >
          Email
        </label>
        <input
          type="email"
          placeholder="Enter member email"
          value={updatedMember.email}
          onChange={(e) =>
            setUpdatedMember({ ...updatedMember, email: e.target.value })
          }
          required
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="studentId"
          className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
        >
          Student ID
        </label>
        <input
          type="text"
          placeholder="Enter student ID"
          value={updatedMember.studentId}
          onChange={(e) =>
            setUpdatedMember({ ...updatedMember, studentId: e.target.value })
          }
          required
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="phoneNumber"
          className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
        >
          Phone Number
        </label>
        <input
          type="text"
          placeholder="Enter phone number"
          value={updatedMember.phoneNumber}
          onChange={(e) =>
            setUpdatedMember({
              ...updatedMember,
              phoneNumber: e.target.value,
            })
          }
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="mb-2 col-span-2">
        <label
          htmlFor="description"
          className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
        >
          Description
        </label>
        <textarea
          placeholder="Enter a brief description"
          value={updatedMember.description}
          onChange={(e) =>
            setUpdatedMember({ ...updatedMember, description: e.target.value })
          }
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white h-28"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="hobbies"
          className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
        >
          Hobbies
        </label>
        <input
          type="text"
          placeholder="Enter hobbies"
          value={updatedMember.hobbies}
          onChange={(e) =>
            setUpdatedMember({ ...updatedMember, hobbies: e.target.value })
          }
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="mb-2 col-span-2 flex items-center">
        <input
          type="checkbox"
          checked={updatedMember.isActive}
          onChange={() =>
            setUpdatedMember((prev) => ({
              ...prev,
              isActive: !prev.isActive,
            }))
          }
          className="mr-2"
        />
        <label className="text-gray-700 dark:text-gray-300 font-semibold">
          Active
        </label>
      </div>
      <div className="mb-2">
        <label
          htmlFor="joinDate"
          className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
        >
          Join Date
        </label>
        <input
          type="date"
          value={updatedMember.joinDate.split("T")[0]} // Format to YYYY-MM-DD
          onChange={(e) =>
            setUpdatedMember({ ...updatedMember, joinDate: e.target.value })
          }
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="col-span-2 flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading} // Disable the button while uploading
          className={`${
            uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold py-2 px-4 rounded-lg`}
        >
          {uploading ? "Updating..." : "Update Member"}
        </button>
      </div>
    </form>
  );
};

export default UpdateMember;
