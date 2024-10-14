import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { storage } from '../firebase'; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const GalleryPage = ({ darkMode }) => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("authtoken");
        if (token) {
          const decodedToken = jwtDecode(token);
          setIsAdmin(decodedToken.role === "admin");
        }

        const response = await fetch(`http://localhost:4600/api/events/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Event not found");

        const data = await response.json();
        setEvent(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024; // 5 MB
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(validateFile);

    if (validFiles.length < selectedFiles.length) {
      setErrorMessage("Some files are invalid. Ensure they are images and less than 5MB.");
    } else {
      setErrorMessage(null);
    }

    setImages(validFiles);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get("authtoken");
      const imageUrls = await Promise.all(images.map(async (imageFile) => {
        const imageRef = ref(storage, `gallery/${id}/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        return await getDownloadURL(imageRef);
      }));

      const response = await fetch(`http://localhost:4600/api/events/${id}/gallery`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ newImages: imageUrls }),
      });

      if (!response.ok) throw new Error("Failed to update gallery");

      const data = await response.json();
      setSuccessMessage(data.message);
      setImages([]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    setLoading(true);
    try {
      const token = Cookies.get("authtoken");
      const response = await fetch(`http://localhost:4600/api/events/${id}/gallery`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) throw new Error("Failed to delete image");

      const data = await response.json();
      setSuccessMessage(data.message);

      setEvent((prevEvent) => ({
        ...prevEvent,
        gallery: prevEvent.gallery.filter((url) => url !== imageUrl)
      }));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto p-4">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-4">
              Gallery - {event ? event.title : 'Event Not Found'}
            </h1>
  
            {successMessage && <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{successMessage}</p>}
            {errorMessage && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMessage}</p>}
  
            {isAdmin && (
              <form onSubmit={handleUpload} className="mb-4">
                <label htmlFor="imageUpload" className="block text-gray-700">Upload Images</label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                  type="submit"
                  className={`mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </form>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {event?.gallery && event.gallery.length > 0 ? (
                event.gallery.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`Gallery Image ${index}`}
                      className="w-full h-full object-cover rounded cursor-pointer aspect-square"
                      onClick={() => handleImageClick(imageUrl)}
                      style={{ aspectRatio: '1 / 1' }} // Ensuring square aspect ratio
                    />
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteImage(imageUrl)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No images available in the gallery.</p>
              )}
            </div>

            {/* Modal for displaying full image */}
            {selectedImage && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Full Size" 
                    className="max-h-[100vh] max-w-[100vw] object-contain" 
                  />
                  <button onClick={closeModal} className="absolute top-4 right-4 text-white text-2xl">
                    &times;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
