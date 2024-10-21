import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import storage functions
import { storage } from "../../firebase"; // Import Firebase Storage
import { MdUpload } from "react-icons/md";

const CreateFaculty = ({ setFaculty, setError, darkMode }) => {
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    facultyId: "",
    pictureURL: null, // URL for the picture
    specialization: [], // Changed to array to match schema
    description: "", // Changed from bio to description
    phoneNumber: "",
    isActive: true, // New property for active status
    joinDate: "", // New property for join date
  });

  const [uploading, setUploading] = useState(false); // To show uploading state
  const [pictureSelected, setPictureSelected] = useState(false); // To track if a picture has been selected

  const handleAddFaculty = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Check if picture is selected
    if (!newFaculty.pictureURL) {
      setError("Please upload a picture.");
      return;
    }

    try {
      // Upload the picture to Firebase Storage
      const storageRef = ref(storage, `faculty/${newFaculty.pictureURL.name}`); // Create storage reference
      const uploadTask = uploadBytesResumable(
        storageRef,
        newFaculty.pictureURL
      ); // Upload the file

      setUploading(true); // Show uploading state

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can monitor progress here if needed
        },
        (error) => {
          console.error("Error during upload: ", error); // Log upload error
          setError(error.message);
          setUploading(false);
        },
        async () => {
          // Get the picture's URL once the upload is complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL: ", downloadURL); // Log download URL

          // After getting the download URL, save the faculty data (including the picture URL) to MongoDB
          const response = await fetch("http://localhost:4600/api/faculty", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newFaculty.name,
              email: newFaculty.email,
              facultyId: newFaculty.facultyId,
              pictureURL: downloadURL, // Save the picture URL
              specializations: newFaculty.specialization, // Use the correct field name
              description: newFaculty.description, // Use description instead of bio
              phoneNumber: newFaculty.phoneNumber,
              isActive: newFaculty.isActive, // Include isActive in the request
              joinDate: new Date().toISOString(), // Set join date to the current date
            }),
            credentials: "include",
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.log("Error response from server: ", errorData); // Log server error
            throw new Error(errorData.message || "Failed to add faculty");
          }

          const data = await response.json();
          console.log("Faculty added successfully: ", data); // Log success

          // Update the faculty state with the new faculty
          setFaculty((prevFaculty) => [...prevFaculty, data.faculty]);

          // Reset the input fields
          setNewFaculty({
            name: "",
            email: "",
            facultyId: "",
            pictureURL: null,
            specialization: [], // Reset specialization
            description: "", // Reset description
            phoneNumber: "",
            isActive: true, // Reset isActive to default value
            joinDate: "", // Reset joinDate
          });
          setPictureSelected(false); // Reset picture selected state

          setUploading(false); // Hide uploading state

          // Refresh the page on successful addition
          window.location.reload();
        }
      );
    } catch (err) {
      console.error("Error adding faculty: ", err); // Log the error
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleAddFaculty} className="container mx-auto text-sm">
      {setError && <p className="text-red-500">{setError}</p>}

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          type="text"
          placeholder="Enter faculty name"
          value={newFaculty.name}
          onChange={(e) =>
            setNewFaculty({ ...newFaculty, name: e.target.value })
          }
          required
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          type="email"
          placeholder="Enter faculty email"
          value={newFaculty.email}
          onChange={(e) =>
            setNewFaculty({ ...newFaculty, email: e.target.value })
          }
          required
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="facultyId"
          className="block text-gray-700 dark:text-gray-300"
        >
          Faculty ID
        </label>
        <input
          type="text"
          placeholder="Enter faculty ID"
          value={newFaculty.facultyId}
          onChange={(e) =>
            setNewFaculty({ ...newFaculty, facultyId: e.target.value })
          }
          required
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="pictureURL"
          className="block text-gray-700 dark:text-gray-300"
        >
          Picture
        </label>
        <div className="flex items-center justify-between w-full mt-1">
          <label className="flex items-center justify-center w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer transition duration-200 dark:bg-gray-800">
            <span className="flex items-center text-gray-600 dark:text-gray-300">
              <MdUpload className="mr-2" /> Select a picture
            </span>
            <input
              type="file"
              onChange={(e) => {
                setNewFaculty({ ...newFaculty, pictureURL: e.target.files[0] });
                setPictureSelected(true);
              }}
              required
              className="hidden"
            />
          </label>
        </div>

        {pictureSelected && newFaculty.pictureURL && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-700 dark:text-gray-300">
              {newFaculty.pictureURL.name}
            </span>
            <button
              type="button"
              onClick={() => {
                setNewFaculty({ ...newFaculty, pictureURL: null });
                setPictureSelected(false);
              }}
              className="text-red-500 hover:underline ml-2"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="specialization"
          className="block text-gray-700 dark:text-gray-300"
        >
          Specialization
        </label>
        <input
          type="text"
          placeholder="Enter specialization (comma separated)"
          value={newFaculty.specialization}
          onChange={(e) =>
            setNewFaculty({
              ...newFaculty,
              specialization: e.target.value,
            })
          }
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          placeholder="Enter a short description"
          value={newFaculty.description}
          onChange={(e) =>
            setNewFaculty({ ...newFaculty, description: e.target.value })
          }
          className="w-full mt-1 p-2 h-28 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="phoneNumber"
          className="block text-gray-700 dark:text-gray-300"
        >
          Phone Number
        </label>
        <input
          type="text"
          placeholder="Enter phone number"
          value={newFaculty.phoneNumber}
          onChange={(e) =>
            setNewFaculty({ ...newFaculty, phoneNumber: e.target.value })
          }
          className="w-full mt-1 p-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="isActive"
          className="inline-flex items-center text-gray-700 dark:text-gray-300"
        >
          <input
            type="checkbox"
            checked={newFaculty.isActive}
            onChange={(e) =>
              setNewFaculty({ ...newFaculty, isActive: e.target.checked })
            }
            className="mr-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
          Active
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-500 hover:bg-blue-700 text-[12px] text-white font-normal py-2 px-4 rounded-md transition-colors duration-300"
        >
          {uploading ? "Uploading..." : "Add Faculty"}
        </button>
      </div>
    </form>
  );
};

export default CreateFaculty;
